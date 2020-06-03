using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ProjetTp1.Data;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ProjetTp1.Pages.Authentification
{
    public class LoginModel : PageModel
    {
        private readonly IdentificationToken _identificationToken;

        public LoginModel(IdentificationToken identificationToken)
        {
            _identificationToken = identificationToken;
        }

        public string ReturnUrl { get; set; }
        public async Task<IActionResult> OnGetAsync(string paramUsername, string token, string paramPseudo)
        {
            if (Login.identificationToken != null)
            {
                if (token != Login.identificationToken.LoginToken[paramUsername])
                {
                    return NotFound();
                }
            }
            else
            {
                return NotFound();
            }



            string returnUrl = Url.Content("~/");
            try
            {
                //On supprime le cookie existant
                await HttpContext
                    .SignOutAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme);
            }
            catch { }


            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, paramPseudo),
                new Claim(ClaimTypes.Role, "Administrator"),
            };
            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                RedirectUri = this.Request.Host.Value
            };
            try
            {
                await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);
            }
            catch (Exception ex)
            {
                string error = ex.Message;
            }

            return LocalRedirect(returnUrl);
        }
    }
}