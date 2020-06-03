using System;
using System.ComponentModel.DataAnnotations;

namespace ProjetTp1.Model
{
    //classe de surcharge d'attribut pour vérifié le minimum lors de l'ajout en base de données
    internal class MinAttribute : ValidationAttribute
    {

        public MinAttribute(int _Min)
        {
            Min = _Min;
        }

        public int Min { get; }

        public string GetErrorMessage() =>
            "Le nombre doit être supérieur à 1";

        public override bool IsValid(object value)
        {
            try
            {
                var number = (int)value;
                if (number >= Min)
                    return true;
                else
                    return false;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}