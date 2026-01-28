using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(opts =>
{
    opts.ListenAnyIP(5285);           // HTTP
    opts.ListenAnyIP(5286, listen =>
    {
        listen.UseHttps();           // Uses dev cert or file cert
    });
});

builder.Services.AddControllers();

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/build";   // the folder created by React build
});

var app = builder.Build();

//app.MapGet("/", () => "Hello World!");

app.UseRouting();

// 5️⃣  Map API endpoints (if you added controllers)
app.MapControllers();

// 6️⃣  Optional CORS – if you want React to call the API directly from its dev server
if (builder.Environment.IsDevelopment())
{
    app.UseCors(cors => cors.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
}

// 7️⃣  The SPA middleware
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "Client";

    // In Development: forward all SPA requests to the React dev server
    if (builder.Environment.IsDevelopment())
    {
        // Doesn't work on Linux with nvm, dotnet uses system PATH and node from nvm is in user path
        //spa.UseReactDevelopmentServer("start");
        spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
    }

    // In Production: serve the pre‑built static files
    // (no extra code needed – `UseSpaStaticFiles` above does that)
});

app.Run();
