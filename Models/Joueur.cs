using System;
using System.ComponentModel.DataAnnotations;

namespace ProjetTp1.Model
{
    public class Joueur
    {

        public int Id { get; set; }
        [Required(ErrorMessage = "Vous n'avez pas saisi votre Nom.")]
        public string Nom { get; set; }
        [Required(ErrorMessage = "Vous n'avez pas saisi votre Prénom.")]
        public string Prenom { get; set; }
        [Required(ErrorMessage = "Vous n'avez pas sélectionné de ville.")]
        [Min(1, ErrorMessage = "Vous n'avez pas sélectionné de ville.")]
        public int IdVille { get; set; }
        [Required(ErrorMessage = "Vous n'avez pas saisi votre Email.")]
        [EmailAddress(ErrorMessage = "L'email n'est pas valide.")]

        public string Email { get; set; }
        [Required(ErrorMessage = "Vous n'avez pas saisi votre Mot de passe.")]
        [MinLength(6, ErrorMessage = "Le mot de passe doit comporter au moins 6 caractères.")]
        public string MotDePasse { get; set; }
        [Required(ErrorMessage = "Vous n'avez pas saisi de Pseudo.")]
        public string Username { get; set; }
        [Range(0, 4)]
        public int Niveau { get; set; }
    }
}
