using System.Collections.Concurrent;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using MADAI_BACKEND.Data;
using MADAI_BACKEND.Models;
using MADAI_BACKEND.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MADAI_BACKEND.Controllers;

public class ReportQuestionDTO
{
    [Required, StringLength(ReportChatService.MaxQuestion)] public string Question { get; set; } = string.Empty;
}

[Authorize]
[ApiController]
[Route("api/MedicalReport/{reportId:guid}/chat")]
public class ReportChatController(AppDbContext db, ReportChatService chat) : ControllerBase
{
    private static readonly ConcurrentDictionary<Guid, byte> Pending = new();
    private Guid? UserId => Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    [HttpGet]
    public async Task<IActionResult> History(Guid reportId)
    {
        if (UserId is not Guid userId) return Unauthorized();
        var report = await db.MedicalReports.AsNoTracking().FirstOrDefaultAsync(r => r.Id == reportId && r.UserId == userId);
        if (report == null) return NotFound();
        var turns = await OwnedTurns(reportId, userId).Take(20).ToListAsync();
        turns.Reverse();
        return Ok(new { turns = turns.Select(ToResponse), available = chat.Available && !string.IsNullOrWhiteSpace(report.ExtractedText), contextTruncated = report.TextTruncated == true || report.ExtractedText?.Length > ReportChatService.MaxContext });
    }

    [HttpPost]
    [RequestSizeLimit(16 * 1024)]
    public async Task<IActionResult> Send(Guid reportId, ReportQuestionDTO input)
    {
        if (UserId is not Guid userId) return Unauthorized();
        var report = await db.MedicalReports.AsNoTracking().FirstOrDefaultAsync(r => r.Id == reportId && r.UserId == userId);
        if (report == null) return NotFound();
        var question = input.Question?.Trim();
        if (!ModelState.IsValid || string.IsNullOrWhiteSpace(question) || question.Length > ReportChatService.MaxQuestion)
            return BadRequest(new { message = "Enter a fictional report question of 1–1,000 characters." });
        if (string.IsNullOrWhiteSpace(report.ExtractedText))
            return Conflict(new { message = "Chat unavailable: this saved report has no extracted text. Upload a readable fictional PDF." });
        if (!Pending.TryAdd(reportId, 0)) return Conflict(new { message = "A question for this report is pending. Please wait." });
        try
        {
            var recent = await OwnedTurns(reportId, userId).Take(6).ToListAsync();
            var answer = await chat.AnswerAsync(report, recent, question);
            var turn = new ReportChatTurn { ReportId = reportId, UserId = userId, Question = question, Answer = answer, ContextTruncated = report.TextTruncated == true || report.ExtractedText.Length > ReportChatService.MaxContext };
            db.ReportChatTurns.Add(turn);
            await db.SaveChangesAsync(); // one atomic successful pair; failed provider requests save nothing
            return Ok(ToResponse(turn));
        }
        catch (ChatUnavailableException) { return StatusCode(503, new { message = "Report chat unavailable: no usable provider is configured." }); }
        catch (OperationCanceledException) { return StatusCode(504, new { message = "Report chat timed out. Please retry your question." }); }
        catch (ChatProviderException) { return StatusCode(502, new { message = "Report chat provider failed or returned an invalid response. Please retry." }); }
        finally { Pending.TryRemove(reportId, out _); }
    }

    private IQueryable<ReportChatTurn> OwnedTurns(Guid reportId, Guid userId) => db.ReportChatTurns.AsNoTracking()
        .Where(t => t.ReportId == reportId && t.UserId == userId).OrderByDescending(t => t.CreatedAt).ThenByDescending(t => t.Id);
    private static object ToResponse(ReportChatTurn turn) => new { turn.Id, turn.Question, turn.Answer, turn.CreatedAt, turn.ContextTruncated, source = "provider" };
}
