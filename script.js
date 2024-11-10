document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('pokemon-gallery');
    const loadMoreButton = document.getElementById('load-more');
    let nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';
    const caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon')) || [];

    function parseUrl(url) {
        return url.split('/').filter(Boolean).pop();
    }

    async function loadPokemon(url) {
        const response = await fetch(url);
        const data = await response.json();
        nextUrl = data.next;
        data.results.forEach(pokemon => addPokemonToGallery(pokemon));
    }

    async function addPokemonToGallery(pokemon) {
        const response = await fetch(pokemon.url);
        const details = await response.json();
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'col-md-3 pokemon-card';
        pokemonCard.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.id}.png" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <button class="btn btn-secondary btn-sm catch-release">${caughtPokemon.includes(details.id) ? 'Release' : 'Catch'}</button>
        `;

        pokemonCard.querySelector('img').addEventListener('click', () => showPokemonDetails(details));
        pokemonCard.querySelector('.catch-release').addEventListener('click', () => toggleCatchRelease(details.id, pokemonCard));

        if (caughtPokemon.includes(details.id)) {
            pokemonCard.classList.add('caught');
        }

        gallery.appendChild(pokemonCard);
    }

    function showPokemonDetails(details) {
        const popup = document.getElementById('popup');
        document.getElementById('popup-image').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.id}.png`;
        document.getElementById('popup-name').textContent = details.name;
        document.getElementById('popup-abilities').textContent = 'Abilities: ' + details.abilities.map(a => a.ability.name).join(', ');
        document.getElementById('popup-types').textContent = 'Types: ' + details.types.map(t => t.type.name).join(', ');
        popup.classList.add('show-popup');
    }

    document.getElementById('close-popup').addEventListener('click', () => {
        document.getElementById('popup').classList.remove('show-popup');
    });

    function toggleCatchRelease(id, card) {
        const index = caughtPokemon.indexOf(id);
        if (index > -1) {
            caughtPokemon.splice(index, 1);
            card.classList.remove('caught');
            card.querySelector('.catch-release').textContent = 'Catch';
        } else {
            caughtPokemon.push(id);
            card.classList.add('caught');
            card.querySelector('.catch-release').textContent = 'Release';
        }
        localStorage.setItem('caughtPokemon', JSON.stringify(caughtPokemon));
    }

    document.getElementById('pokemon-search').addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();
        const pokemonCards = document.querySelectorAll('.pokemon-card');

        pokemonCards.forEach(card => {
            const pokemonName = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = pokemonName.includes(searchValue) ? 'block' : 'none';
        });
    });

    loadPokemon(nextUrl);
    loadMoreButton.addEventListener('click', () => loadPokemon(nextUrl));
});
