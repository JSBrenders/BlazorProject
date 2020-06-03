using ProjetTp1.Data.InterfaceDB;
using ProjetTp1.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace ProjetTp1.Custom
{
    //Classe de surcharge d'attribut non utilisée (non fonctionnelle)
    public class NoDuplicateAttribute : ValidationAttribute
    {
        private readonly ProjetTp1Context _context;
        public string _pseudo;
        public Boolean _type;
        public NoDuplicateAttribute(ProjetTp1Context context, bool type)
        {
            _context = context;
            //_pseudo = pseudo;
            _type = type;
        }

        public string GetErrorMessage()
        {
            if (!_type)
            {
                return "Ce pseudo est déjà pris";
            }
            else return "Cette adresse E-mail est déjà prise";
        }

        protected override ValidationResult IsValid(object value,
            ValidationContext validationContext)
        {
            JoueursController joueurController = new JoueursController(_context);

            _pseudo = value.ToString();

            if (!_type)
            {
                Boolean exists = (joueurController.GetJoueurParPseudo(_pseudo) != null);

                if (!exists)
                {
                    return new ValidationResult(GetErrorMessage());
                }
                return ValidationResult.Success;
            }
            else
            {
                Boolean exists = (joueurController.GetJoueurParEmail(_pseudo) != null);

                if (!exists)
                {
                    return new ValidationResult(GetErrorMessage());
                }
                return ValidationResult.Success;
            }


        }
    }
}
