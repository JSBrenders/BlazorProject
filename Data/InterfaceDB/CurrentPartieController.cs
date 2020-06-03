using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetTp1.Model;
using ProjetTp1.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace ProjetTp1.Data.InterfaceDB
{
    [Route("api/CurrentPartie")]
    [ApiController]
    public class CurrentPartieController : ControllerBase
    {
        private readonly ProjetTp1Context _context;

        public CurrentPartieController(ProjetTp1Context context)
        {
            _context = context;
        }

        // GET: api/CurrentParties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CurrentPartie>>> GetPartie()
        {
            return await _context.CurrentPartie.ToListAsync();
        }

        public async Task<CurrentPartie> GetPartieParId(int IdJoueur)
        {
            return await _context.CurrentPartie.Where(x => x.IdJoueur == IdJoueur & x.EnCours).FirstOrDefaultAsync();
        }


        [HttpPost]
        public async Task<ActionResult<CurrentPartie>> AddPartieEncours(CurrentPartie currentPartie)
        {
            _context.CurrentPartie.Add(currentPartie);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetPartie", new { id = currentPartie.Id }, currentPartie);
        }

        public async Task<ActionResult<Partie>> AddCurrentPartie(CurrentPartie currentPartie)
        {
            _context.CurrentPartie.Add(currentPartie);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetPartie", new { id = currentPartie.Id }, currentPartie);
        }

        // PUT: api/CurrentPartie/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCurrentPartie(int id, CurrentPartie currentPartie)
        {
            if (id != currentPartie.Id)
            {
                return BadRequest();
            }

            _context.Entry(currentPartie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CurrentPartieExists(id))
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


        public async Task DeletePartie(int Id)
        {
            try
            {
                var partie = await _context.CurrentPartie.FindAsync(Id);
                _context.CurrentPartie.Remove(partie);
                await _context.SaveChangesAsync();
            }
            catch { }
        }
        // DELETE: api/CurrentPartie/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<CurrentPartie>> DeleteCurrentPartie(int id)
        {
            var CurrentPartie = await _context.CurrentPartie.FindAsync(id);
            if (CurrentPartie == null || id == 0)
            {
                return null;
            }

            _context.CurrentPartie.Remove(CurrentPartie);
            await _context.SaveChangesAsync();

            return CurrentPartie;
        }

        private bool CurrentPartieExists(int id)
        {
            return _context.CurrentPartie.Any(e => e.Id == id);
        }
    }
}
