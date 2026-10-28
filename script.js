// Données : en vrai site, elles viendraient d'une base de données
const produits = [
  { id: 1, nom: "Clavier mécanique", prix: 25000, emoji: "⌨️" },
  { id: 2, nom: "Souris sans fil",   prix: 8000,  emoji: "🖱️" },
  { id: 3, nom: "Casque audio",      prix: 15000, emoji: "🎧" },
  { id: 4, nom: "Batterie externe",  prix: 12000, emoji: "🔋" },
  { id: 5, nom: "Clé USB 64 Go",     prix: 5000,  emoji: "💾" },
  { id: 6, nom: "Lampe solaire",     prix: 7500,  emoji: "💡" }
];

// Le panier : { idProduit: quantité }
let panier = {};

try {
  panier = JSON.parse(localStorage.getItem("panier")) || {};
} catch (e) {
  panier = {};
}

const formater = (n) => n.toLocaleString("fr-FR") + " FCFA";

function sauvegarder() {
  try {
    localStorage.setItem("panier", JSON.stringify(panier));
  } catch (e) { /* stockage indisponible : on ignore */ }
}

function afficherProduits() {
  const zone = document.getElementById("produits");
  zone.innerHTML = produits.map((p) => `
    <article class="carte">
      <div class="emoji">${p.emoji}</div>
      <h3>${p.nom}</h3>
      <p class="prix">${formater(p.prix)}</p>
      <button class="btn-ajouter" data-id="${p.id}">Ajouter au panier</button>
    </article>
  `).join("");
}

function afficherPanier() {
  const liste = document.getElementById("liste-panier");
  let total = 0;
  let nombre = 0;

  const lignes = Object.entries(panier).map(([id, qte]) => {
    const p = produits.find((x) => x.id === Number(id));
    total += p.prix * qte;
    nombre += qte;
    return `
      <li>
        <span>${p.nom} × ${qte}</span>
        <span>${formater(p.prix * qte)}
          <button class="btn-secondaire" data-retirer="${p.id}" aria-label="Retirer ${p.nom}">−</button>
        </span>
      </li>`;
  });

  liste.innerHTML = lignes.length ? lignes.join("") : "<li>Le panier est vide.</li>";
  document.getElementById("total").textContent = formater(total);
  document.getElementById("compteur").textContent = nombre;
}

function ajouter(id) {
  panier[id] = (panier[id] || 0) + 1;
  sauvegarder();
  afficherPanier();
}

function retirer(id) {
  if (!panier[id]) return;
  panier[id] -= 1;
  if (panier[id] <= 0) delete panier[id];
  sauvegarder();
  afficherPanier();
}

document.getElementById("produits").addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (id) ajouter(Number(id));
});

document.getElementById("liste-panier").addEventListener("click", (e) => {
  const id = e.target.dataset.retirer;
  if (id) retirer(Number(id));
});

document.getElementById("btn-panier").addEventListener("click", () => {
  const zone = document.getElementById("panier");
  zone.hidden = !zone.hidden;
});

document.getElementById("btn-vider").addEventListener("click", () => {
  panier = {};
  sauvegarder();
  afficherPanier();
});

afficherProduits();
afficherPanier();
