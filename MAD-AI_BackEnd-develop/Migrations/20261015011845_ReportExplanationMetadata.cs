using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MADAI_BACKEND.Migrations
{
    /// <inheritdoc />
    public partial class ReportExplanationMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExtractedText",
                table: "MedicalReports",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDemo",
                table: "MedicalReports",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TextTruncated",
                table: "MedicalReports",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtractedText",
                table: "MedicalReports");

            migrationBuilder.DropColumn(
                name: "IsDemo",
                table: "MedicalReports");

            migrationBuilder.DropColumn(
                name: "TextTruncated",
                table: "MedicalReports");
        }
    }
}
