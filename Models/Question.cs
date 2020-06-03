using System;
using System.ComponentModel.DataAnnotations;

namespace ProjetTp1.Model
{
    public class Question
    {
        public int Id { get; set; }
        public int IdPartie { get; set; }
        public int IdVerbe { get; set; }
        [Required(ErrorMessage = "Vous n'avez pas saisi de réponse pour le participe passé")]
        public string ReponseParticipe { get; set; }
        [Required(ErrorMessage = "Vous n'avez pas saisi de réponse pour le prétérit")]
        public string ReponsePreterit { get; set; }
        [DataType(DataType.Date)]
        public DateTime DateEnvoie { get; set; }
        [DataType(DataType.Date)]
        public DateTime DateReponse { get; set; }
    }
}
