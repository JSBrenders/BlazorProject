using Blazored.Toast;
using BlazorScopedCss;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ProjetTp1.Data;
using ProjetTp1.Data.InterfaceDB;
using ProjetTp1.Models;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;

namespace ProjetTp1
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            //toasts
            services.AddBlazoredToast();
            //registration Notification
            services.AddSingleton<RegistrationService>();
            //cookies
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            services.AddAuthentication(
                CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie();
            //end cookies
            services.AddRazorPages();
            services.AddServerSideBlazor();
            services.AddSingleton<RegistrationService>();
            //begin cookies
            services.AddHttpContextAccessor();
            services.AddScoped<HttpContextAccessor>();
            services.AddHttpClient();
            services.AddScoped<HttpClient>();
            //end cookies
            services.AddScoped<VillesController>();
            services.AddScoped<JoueursController>();
            services.AddScoped<VerbesController>();
            services.AddScoped<PartiesController>();
            services.AddScoped<QuestionsController>();
            services.AddScoped<CurrentPartieController>();
            services.AddBlazorScopedCss(Assembly.GetExecutingAssembly());
            services.AddHttpContextAccessor();
            //services.AddDbContext<ProjetTp1Context>(options =>
            //        options.UseSqlServer(Configuration.GetConnectionString("ProjetTp1Context")));
            services.AddDbContext<ProjetTp1Context>();
            services.AddScoped<IdentificationToken>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ProjetTp1Context context)
        {
            try
            {
                context.Database.Migrate();
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.Print(e.ToString());
            }

            try
            {
                string script_verbe = File.ReadAllText("Migrations/Scripts données/dbo.Verbe.data.sql");
                string script_villes = File.ReadAllText("Migrations/Scripts données/dbo.Ville.data.sql");
                if (context.Verbe.Count() < 161)
                {
                    if (context.Verbe.Count() > 0)
                    {
                        context.Database.ExecuteSqlRaw("DELETE FROM dbo.Verbe");
                    }
                    context.Database.ExecuteSqlRaw(script_verbe);
                }
                if (context.Ville.Count() < 38000)
                {
                    if (context.Ville.Count() > 0)
                    {
                        context.Database.ExecuteSqlRaw("DELETE FROM dbo.Ville");
                    }
                    context.Database.ExecuteSqlRaw(script_villes);
                }
            }
            catch
            {

            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();


            //begin cookies
            app.UseCookiePolicy();
            app.UseAuthentication();
            app.UseAuthorization();
            //end cookies


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapBlazorHub();
                endpoints.MapFallbackToPage("/_Host");
                endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
