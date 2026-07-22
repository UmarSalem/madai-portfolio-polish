using MADAI_BACKEND.Contracts;
using MADAI_BACKEND.Models.DTO;
using System.Net.Http.Json;
using System.Text.Json;

namespace MADAI_BACKEND.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public DoctorService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<List<DoctorDto>> SearchDoctorsAsync(string location, string specialty)
        {
            var safeLocation = location.Trim();
            var safeSpecialty = specialty.Trim();
            var apiKey = _configuration["GoogleMaps:ApiKey"] ?? _configuration["GoogleApiKey"];

            if (IsMissingProviderConfig(apiKey))
            {
                return CreateDemoDoctors(safeLocation, safeSpecialty);
            }

            try
            {
                var query = $"{safeSpecialty} doctors in {safeLocation}";
                var url = $"https://maps.googleapis.com/maps/api/place/textsearch/json?query={Uri.EscapeDataString(query)}&key={apiKey}";

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadFromJsonAsync<JsonElement>();
                if (!json.TryGetProperty("results", out var results))
                {
                    return CreateDemoDoctors(safeLocation, safeSpecialty);
                }

                var doctorList = new List<DoctorDto>();

                foreach (var result in results.EnumerateArray())
                {
                    var placeId = result.TryGetProperty("place_id", out var id) ? id.GetString() : string.Empty;
                    var name = result.TryGetProperty("name", out var n) ? n.GetString() : string.Empty;
                    var address = result.TryGetProperty("formatted_address", out var a) ? a.GetString() : string.Empty;
                    var rating = result.TryGetProperty("rating", out var r) ? r.GetDouble() : 0;
                    var userRatings = result.TryGetProperty("user_ratings_total", out var ur) ? ur.GetInt32() : 0;
                    var phone = string.Empty;
                    var website = string.Empty;

                    if (!string.IsNullOrWhiteSpace(placeId))
                    {
                        var detailsUrl = $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&fields=formatted_phone_number,website&key={apiKey}";
                        var detailsResponse = await _httpClient.GetAsync(detailsUrl);

                        if (detailsResponse.IsSuccessStatusCode)
                        {
                            var detailsJson = await detailsResponse.Content.ReadFromJsonAsync<JsonElement>();
                            if (detailsJson.TryGetProperty("result", out var resultDetails))
                            {
                                phone = resultDetails.TryGetProperty("formatted_phone_number", out var p) ? p.GetString() ?? string.Empty : string.Empty;
                                website = resultDetails.TryGetProperty("website", out var w) ? w.GetString() ?? string.Empty : string.Empty;
                            }
                        }
                    }

                    doctorList.Add(new DoctorDto
                    {
                        Name = name ?? string.Empty,
                        Address = address ?? string.Empty,
                        PhoneNumber = phone,
                        Website = website,
                        Location = safeLocation,
                        Specialty = safeSpecialty,
                        Rating = rating,
                        UserRatingsTotal = userRatings,
                        IsDemo = false
                    });
                }

                return doctorList;
            }
            catch
            {
                return CreateDemoDoctors(safeLocation, safeSpecialty);
            }
        }

        private static bool IsMissingProviderConfig(string? apiKey)
        {
            return string.IsNullOrWhiteSpace(apiKey)
                || apiKey.Contains("replace", StringComparison.OrdinalIgnoreCase)
                || apiKey.Contains("placeholder", StringComparison.OrdinalIgnoreCase)
                || apiKey.Contains("demo", StringComparison.OrdinalIgnoreCase);
        }

        private static List<DoctorDto> CreateDemoDoctors(string location, string specialty)
        {
            var safeLocation = string.IsNullOrWhiteSpace(location) ? "Demo City" : location;
            var safeSpecialty = string.IsNullOrWhiteSpace(specialty) ? "Demo Specialty" : specialty;

            return new List<DoctorDto>
            {
                new()
                {
                    Name = $"Demo {safeSpecialty} Clinic",
                    Address = "100 Demo Health Street",
                    PhoneNumber = "Demo phone not available",
                    Website = "https://example.test/madai-demo-clinic",
                    Location = safeLocation,
                    Specialty = safeSpecialty,
                    Rating = 4.6,
                    UserRatingsTotal = 24,
                    IsDemo = true
                },
                new()
                {
                    Name = $"Fictional {safeSpecialty} Care",
                    Address = "200 Fictional Care Avenue",
                    PhoneNumber = "Demo phone not available",
                    Website = "https://example.test/fictional-care",
                    Location = safeLocation,
                    Specialty = safeSpecialty,
                    Rating = 4.3,
                    UserRatingsTotal = 18,
                    IsDemo = true
                }
            };
        }
    }
}
