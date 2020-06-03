using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Threading.Tasks;

namespace ProjetTp1.Pages.Authentification
{
    public class logoutModel : PageModel
    {
        public async Task<IActionResult> OnGetAsync()
        {
            // On supprime le token d'identifiction
            var Username = HttpContext.User.Identity.Name;
            if (Login.identificationToken != null)
            {
                if (Login.identificationToken.LoginToken.ContainsKey(Username))
                {
                    Login.identificationToken.LoginToken[Username] = "";
                }
            }
            // Suppression du cookie
            await HttpContext
                .SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);
            return LocalRedirect(Url.Content("~/"));
        }

    }
}