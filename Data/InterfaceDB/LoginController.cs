using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjetTp1.Custom;
using ProjetTp1.Model;
using ProjetTp1.Models;
using ProjetTp1.Pages;
using System.Threading.Tasks;

namespace ProjetTp1.Data.InterfaceDB
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ProjetTp1Context _context;

        public LoginController(ProjetTp1Context context)
        {
            _context = context;
        }



        public string ReturnUrl { get; set; }
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] Login.SubscribeModel Model)
        {
            if (!ModelState.IsValid)
            {
                return NotFound();
            }

            JoueursController JoueursController;
            Joueur joueur;

            try
            {
                JoueursController = new JoueursController(_context);
                joueur = await JoueursController.GetJoueurParEmail(Model.Login);
                if (joueur == null)
                {
                    joueur = await JoueursController.GetJoueurParPseudo(Model.Login);
                }
            }
            catch
            {
                joueur = null;
            }

            if (joueur == null)
            {
                return NotFound();
            }
            if (joueur.MotDePasse != HashGenerator.SHA256(Model.Password))
            {
                return StatusCode(202);
            }

            return StatusCode(200);

        }
    }
}