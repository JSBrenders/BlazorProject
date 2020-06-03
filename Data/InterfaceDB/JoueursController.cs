using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetTp1.Model;
using ProjetTp1.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjetTp1.Data.InterfaceDB
{
    [Route("api/[controller]")]
    [ApiController]
    public class JoueursController : ControllerBase
    {
        private readonly ProjetTp1Context _context;

        public JoueursController(ProjetTp1Context context)
        {
            _context = context;
        }


        // GET: api/Joueurs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Joueur>>> GetJoueur()
        {
            return await _context.Joueur.ToListAsync();
        }

        public async Task<Joueur> GetJoueurParId(int Id)
        {
            return await _context.Joueur.FindAsync(Id);
        }


        public async Task<Joueur> GetJoueurParEmail(string email)
        {
            if (email != null)
            {
                //Joueur joueur = await _context.Joueur.Where(x => x.Email == email).FirstOrDefault();
                var joueur = await _context.Joueur.Where(x => x.Email.ToLower().Trim() == email.ToLower().Trim()).FirstOrDefaultAsync();
                if (joueur == null)
                {
                    return null;
                }
                return joueur;
            }
            else
            {
                return null;
            }
        }


        public async Task<Joueur> GetJoueurParPseudo(string pseudo)
        {
            if (pseudo != null)
            {
                Joueur joueur = null;
                //Joueur joueur = await _context.Joueur.Where(x => x.Email == email).FirstOrDefault();
                if (pseudo != "")
                {
                    joueur = await _context.Joueur.Where(x => x.Username.ToLower().Trim() == pseudo.ToLower().Trim()).FirstOrDefaultAsync();
                }
                if (joueur == null)
                {
                    return null;
                }
                return joueur;
            }
            else return null;
        }

        // GET: api/Joueurs/pseudo
        [HttpGet("pseudo/{pseudo}")]
        public async Task<ActionResult<Joueur>> GetJoueur(string pseudo)
        {
            if (pseudo != null)
            {
                Joueur joueur = null;
                if (pseudo != "")
                {
                    joueur = await _context.Joueur.Where(x => x.Username.ToLower().Trim() == pseudo.ToLower().Trim()).FirstOrDefaultAsync();
                }
                if (joueur == null)
                {
                    return null;
                }
                return joueur;
            }
            else return null;
        }

        public async Task<List<int>> GetJoueursId()
        {
            var liste = await _context.Joueur.Select(x => x.Id).Distinct().ToListAsync();
            return liste;
        }
        // GET api/Joueurs/liste
        [HttpGet("liste")]
        public async Task<ActionResult<List<int>>> GetJoueursListeId()
        {
            var liste = await _context.Joueur.Select(x => x.Id).Distinct().ToListAsync();
            return liste;
        }

        // GET: api/Joueurs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Joueur>> GetJoueur(int id)
        {
            var joueur = await _context.Joueur.FindAsync(id);

            if (joueur == null)
            {
                return NotFound();
            }

            return joueur;
        }

        // PUT: api/Joueurs/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJoueur(int id, Joueur joueur)
        {
            if (id != joueur.Id)
            {
                return BadRequest();
            }

            _context.Entry(joueur).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JoueurExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Joueurs
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Joueur>> PostJoueur(Joueur joueur)
        {
            _context.Joueur.Add(joueur);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetJoueur", new { id = joueur.Id }, joueur);
        }

        // DELETE: api/Joueurs/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Joueur>> DeleteJoueur(int id)
        {
            var joueur = await _context.Joueur.FindAsync(id);
            if (joueur == null)
            {
                return NotFound();
            }

            _context.Joueur.Remove(joueur);
            await _context.SaveChangesAsync();

            return joueur;
        }

        private bool JoueurExists(int id)
        {
            return _context.Joueur.Any(e => e.Id == id);
        }
    }
}
