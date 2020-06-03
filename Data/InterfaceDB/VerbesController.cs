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
    public class VerbesController : ControllerBase
    {
        private readonly ProjetTp1Context _context;

        public VerbesController(ProjetTp1Context context)
        {
            _context = context;
        }

        // GET: api/Verbes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Verbe>>> GetVerbe()
        {
            return await _context.Verbe.ToListAsync();
        }

        public async Task<List<Verbe>> GetVerbesListe()
        {
            return await _context.Verbe.ToListAsync();
        }

        public async Task<Verbe> GetVerbeParId(int id)
        {
            return await _context.Verbe.FindAsync(id);
        }

        // GET: api/Verbes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Verbe>> GetVerbe(int id)
        {
            var verbe = await _context.Verbe.FindAsync(id);

            if (verbe == null)
            {
                return NotFound();
            }

            return verbe;
        }

        // PUT: api/Verbes/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVerbe(int id, Verbe verbe)
        {
            if (id != verbe.Id)
            {
                return BadRequest();
            }

            _context.Entry(verbe).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VerbeExists(id))
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

        // POST: api/Verbes
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Verbe>> PostVerbe(Verbe verbe)
        {
            _context.Verbe.Add(verbe);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVerbe", new { id = verbe.Id }, verbe);
        }

        // DELETE: api/Verbes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Verbe>> DeleteVerbe(int id)
        {
            var verbe = await _context.Verbe.FindAsync(id);
            if (verbe == null)
            {
                return NotFound();
            }

            _context.Verbe.Remove(verbe);
            await _context.SaveChangesAsync();

            return verbe;
        }

        private bool VerbeExists(int id)
        {
            return _context.Verbe.Any(e => e.Id == id);
        }
    }
}
