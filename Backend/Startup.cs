using System.Reflection;
using AutoMapper;
using Backend.Data;
using Backend.Repositories.Implementations;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace Backend;

public class Startup
{
    private readonly IConfiguration _configuration;

    public Startup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // This replaces builder.Services.Add...
    public void ConfigureServices(IServiceCollection services)
    {
        // DB Config
        var connectionString = _configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

        // Add Controllers
        services.AddControllers();

        // Swagger
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        // Repositories
        services.AddScoped<UserRepository>();
        services.AddScoped<EventRepository>();
        services.AddScoped<PeriodRepository>();

        // Services
        services.AddScoped<UserService>();
        services.AddScoped<EventService>();
        services.AddScoped<PeriodService>();

        // Mapper service
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
    }

    public void Configure(WebApplication app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                options.RoutePrefix = "";
            });
        }

        app.UseHttpsRedirection();
        app.MapControllers();
    }
}
