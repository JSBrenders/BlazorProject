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
    [Migration("20200115132613_Migration2")]
    partial class Migration2
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ProjetTp1.Model.Joueur", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("idVille")
                        .HasColumnType("int");

                    b.Property<string>("motDePasse")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("niveau")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("nom")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("prenom")
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

                    b.Property<int>("idJoueur")
                        .HasColumnType("int");

                    b.Property<int>("score")
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

                    b.Property<DateTime>("dateEnvoie")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("dateReponse")
                        .HasColumnType("datetime2");

                    b.Property<int>("idPartie")
                        .HasColumnType("int");

                    b.Property<int>("idVerbe")
                        .HasColumnType("int");

                    b.Property<string>("reponseParticipant")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("reponsePreterit")
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