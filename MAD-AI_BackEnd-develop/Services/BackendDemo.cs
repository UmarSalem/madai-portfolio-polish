namespace MADAI_BACKEND.Services;

public static class BackendDemo
{
    // Absent setting preserves normal provider behavior.
    public static bool IsEnabled(IConfiguration configuration) => configuration.GetValue<bool>("BackendDemo:Enabled");
}

// Defense in depth for all factory-managed provider HTTP clients, including
// loopback test providers. Service gates supply the appropriate fallback/error.
public sealed class BackendDemoProviderGuard(IConfiguration configuration) : DelegatingHandler
{
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        if (BackendDemo.IsEnabled(configuration))
            throw new InvalidOperationException("Provider HTTP calls are disabled in backend demo mode.");
        return base.SendAsync(request, cancellationToken);
    }
}
