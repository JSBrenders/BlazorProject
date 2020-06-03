using Microsoft.EntityFrameworkCore.Migrations;

namespace ProjetTp1.Migrations
{
    public partial class pseudo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "niveau",
                table: "Joueur");

            migrationBuilder.RenameColumn(
                name: "prenom",
                table: "Joueur",
                newName: "Prenom");

            migrationBuilder.RenameColumn(
                name: "nom",
                table: "Joueur",
                newName: "Nom");

            migrationBuilder.RenameColumn(
                name: "motDePasse",
                table: "Joueur",
                newName: "MotDePasse");

            migrationBuilder.RenameColumn(
                name: "idVille",
                table: "Joueur",
                newName: "IdVille");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Joueur",
                newName: "Email");

            migrationBuilder.AlterColumn<string>(
                name: "Prenom",
                table: "Joueur",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Nom",
                table: "Joueur",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MotDePasse",
                table: "Joueur",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Joueur",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Joueur",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "Joueur");

            migrationBuilder.RenameColumn(
                name: "Prenom",
                table: "Joueur",
                newName: "prenom");

            migrationBuilder.RenameColumn(
                name: "Nom",
                table: "Joueur",
                newName: "nom");

            migrationBuilder.RenameColumn(
                name: "MotDePasse",
                table: "Joueur",
                newName: "motDePasse");

            migrationBuilder.RenameColumn(
                name: "IdVille",
                table: "Joueur",
                newName: "idVille");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Joueur",
                newName: "email");

            migrationBuilder.AlterColumn<string>(
                name: "prenom",
                table: "Joueur",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "nom",
                table: "Joueur",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "motDePasse",
                table: "Joueur",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "Joueur",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<string>(
                name: "niveau",
                table: "Joueur",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
