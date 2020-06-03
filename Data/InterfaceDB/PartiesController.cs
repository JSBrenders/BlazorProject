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
    public class PartiesController : ControllerBase
    {
        private readonly ProjetTp1Context _context;

        public PartiesController(ProjetTp1Context context)
        {
            _context = context;
        }

        // GET: api/Parties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Partie>>> GetPartie()
        {
            return await _context.Partie.ToListAsync();
        }

        public async Task<ActionResult<Partie>> HighScore(int IdJoueur)
        {
            var listeParties = await _context.Partie.Where(x => x.IdJoueur == IdJoueur).ToListAsync();
            if (listeParties.Count() == 0)
            {
                return null;
            }
            else
            {
                //var listeScoreParties = await _context.Partie.Where(x => x.IdJoueur == IdJoueur).Select(p => p.Score).ToListAsync();
                //int max = listeScore
                int max = listeParties.Max(e => e.Score);
                Partie partie = listeParties.Where(x => x.Score == max).FirstOrDefault();
                return partie;
                //return _context.Partie.Where(x => x.idJoueur == IdJoueur).Select(p => p.score).Max();
            }
        }

        [HttpGet("highscore/{IdJoueur}/{difficulty?}")]
        public async Task<ActionResult<Partie>> GetHighScore(int IdJoueur, int? difficulty)
        {
            if (difficulty != null)
            {
                var listeParties = await _context.Partie.Where(x => x.IdJoueur == IdJoueur).ToListAsync();
                if (listeParties.Count() == 0)
                {
                    return null;
                }
                else
                {
                    var ListeParties = listeParties.Where(x => x.Difficulty == difficulty).ToList();
                    try
                    {
                        if (listeParties.Count() == 0)
                        {
                            return null;
                        }
                        else
                        {
                            int max = ListeParties.Max(e => e.Score);
                            Partie partie = ListeParties.Where(x => x.Score == max).FirstOrDefault();
                            return partie;
                        }
                    }
                    catch
                    {
                        return null;
                    }
                }
            }
            else
            {
                var listeParties = await _context.Partie.Where(x => x.IdJoueur == IdJoueur).ToListAsync();
                if (listeParties.Count() == 0)
                {
                    return null;
                }
                else
                {
                    int max = listeParties.Max(e => e.Score);
                    var ListBestPartie = listeParties.Where(x => x.Score == max).ToList();
                    if (ListBestPartie.Count() > 1)
                    {
                        int MaxDifficulty = ListBestPartie.Max(e => e.Difficulty);
                        Partie BestPartie = ListBestPartie.Where(x => x.Difficulty == MaxDifficulty).FirstOrDefault();
                        return BestPartie;
                    }
                    else if (ListBestPartie.Count() == 1)
                    {
                        return ListBestPartie[0];
                    }
                    else return null;
                }
            }
        }


        public async Task<List<Partie>> GetAllParties()
        {
            return await _context.Partie.ToListAsync();
        }
        // Get All parties
        [HttpGet("liste")]
        public async Task<ActionResult<List<Partie>>> GetListeAllParties()
        {
            var liste = await _context.Partie.ToListAsync();
            return liste;
        }

        public async Task<Partie> GetPartieParID(int Id)
        {
            try
            {
                var liste = await _context.Partie.FindAsync(Id);
                return liste;
            }
            catch
            {
                return null;
            }

        }


        // GET: api/Parties/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Partie>> GetPartie(int id)
        {
            var partie = await _context.Partie.FindAsync(id);

            if (partie == null)
            {
                return NotFound();
            }

            return partie;
        }

        // PUT: api/Parties/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPartie(int id, Partie partie)
        {
            if (id != partie.Id)
            {
                return BadRequest();
            }

            _context.Entry(partie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PartieExists(id))
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

        // POST: api/Parties
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Partie>> PostPartie(Partie partie)
        {
            _context.Partie.Add(partie);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPartie", new { id = partie.Id }, partie);
        }

        public async Task<ActionResult<Partie>> AddPartie(Partie partie)
        {
            _context.Partie.Add(partie);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetPartie", new { id = partie.Id }, partie);
        }

        // DELETE: api/Parties/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Partie>> DeletePartie(int id)
        {
            var partie = await _context.Partie.FindAsync(id);
            if (partie == null)
            {
                return NotFound();
            }

            _context.Partie.Remove(partie);
            await _context.SaveChangesAsync();

            return partie;
        }

        private bool PartieExists(int id)
        {
            return _context.Partie.Any(e => e.Id == id);
        }
    }
}
