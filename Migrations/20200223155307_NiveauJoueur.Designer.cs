﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ProjetTp1.Models;

namespace ProjetTp1.Migrations
{
    [DbContext(typeof(ProjetTp1Context))]
    [Migration("20200223155307_NiveauJoueur")]
    partial class NiveauJoueur
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ProjetTp1.Model.CurrentPartie", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("Difficulty")
                        .HasColumnType("int");

                    b.Property<bool>("EnCours")
                        .HasColumnType("bit");

                    b.Property<int>("IdJoueur")
                        .HasColumnType("int");

                    b.Property<int>("IdPartie")
                        .HasColumnType("int");

                    b.Property<string>("ListeVerbes")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RangListe")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("CurrentPartie");
                });

            modelBuilder.Entity("ProjetTp1.Model.Joueur", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("IdVille")
                        .HasColumnType("int");

                    b.Property<string>("MotDePasse")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Niveau")
                        .HasColumnType("int");

                    b.Property<string>("Nom")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Prenom")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Joueur");
                });

            modelBuilder.Entity("ProjetTp1.Model.Partie", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("Difficulty")
                        .HasColumnType("int");

                    b.Property<int>("IdJoueur")
                        .HasColumnType("int");

                    b.Property<int>("Score")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Partie");
                });

            modelBuilder.Entity("ProjetTp1.Model.Question", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("DateEnvoie")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("DateReponse")
                        .HasColumnType("datetime2");

                    b.Property<int>("IdPartie")
                        .HasColumnType("int");

                    b.Property<int>("IdVerbe")
                        .HasColumnType("int");

                    b.Property<string>("ReponseParticipe")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ReponsePreterit")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Question");
                });

            modelBuilder.Entity("ProjetTp1.Model.Verbe", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("baseVerbarle")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("participePasse")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("preterit")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("traduction")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Verbe");
                });

            modelBuilder.Entity("ProjetTp1.Model.Ville", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("codePostal")
                        .HasColumnType("int");

                    b.Property<string>("nom")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Ville");
                });
#pragma warning restore 612, 618
        }
    }
}
