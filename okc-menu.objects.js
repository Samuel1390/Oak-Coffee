
const okcMainCardId = 'okc-main-card'
const okcMenuCardId = 'okc-menu-card'

class Item {
    constructor(name, price, source) {
        this.name = name;
        this.price = price;
        this.source = source;
    }
    /*METODO PARA RENDERIZAR EL OBJETO/PRODUCTO CLICKEADO*/
    renderCardItem(cardHtmlId) { //recibe la carta del documento actual pagina principal/okc menu
        const cardHtml = document.getElementById(cardHtmlId)
        const classConstructor = this.constructor.name;
        cardHtml.style.display = 'flex'
        const cardForm = cardHtml.querySelector('.card-form')
        const itemImg = cardHtml.querySelector('img')
        const itemName = cardHtml.querySelector('.card-name')
        const itemsAmount = cardHtml.querySelector('#items-amount')
        const itemsPreferences = cardHtml.querySelector('.card-fieldset')
        const itemPrice =  cardHtml.querySelector('.price-indicator')
        const makeDaliveryButton = cardHtml.querySelector('.make-delivery-button')
        const firstLegend = itemsPreferences.querySelector('.card-legend') //accesibilidad web
        itemPrice.textContent = this.price + '$'
        itemName.textContent = this.name
        itemImg.src = this.source
        firstLegend.focus() //hace foco en la primera etiqueta legend de para accesibilidad web
        const currentTheme = loadTheme()
        if (currentTheme === 'dark') {
            cardForm.classList.add('dark')
        } else {
            cardForm.classList.remove('dark')
        }
        makeDaliveryButton.addEventListener('click', ()=> {
            Swal.fire({
                position: "top-end",
                title: 'Página usada como proyecto de frontend',
                showConfirmButton: false,
                html: `Esta página pertenece a una tienda ficticia, el sitio web es usado como proyecto de frontend del desarrollador:
                <a href="https://github.com/Samuel1390" target="_blank" rel='noopener'>Samuel Nelo</a>`,
                confirmButtonText: 'Cool',
                timer: 2500
            });
        })
        if (this.milkAmount === null) {
            //caso especial para los tes, activa la opcion de seleccionar el monto del azucar pero desactiva el monto de la leche
            const milkSelect = document.getElementById('milk-select')
            milkSelect.style.opacity = '.5'
            milkSelect.previousElementSibling.style.opacity = '.5'
            milkSelect.setAttribute('disabled', true)
        }
        else if (classConstructor !== 'Coffee') {
            //notificacion al usuario de que las preferencias son para los cafes y tes
            itemsPreferences.lastElementChild.textContent = 'Las preferencias se aplican a los cafés y tés'
            itemsPreferences.style.opacity = '.5'
            itemsPreferences.setAttribute('disabled', true)
        }
        itemsAmount.addEventListener('input', event=> {
            const value = itemsAmount.value
            itemPrice.textContent = (value*this.price) + '$'
            if (value < 0) {
                itemsAmount.value = 0
            }
        })
    }
}
class Coffee extends Item {
    constructor(name, price, source, sugarAmonunt='traditional', milkAmount='traditional') {
        super(name, price, source);
        this.sugarAmonunt = sugarAmonunt;
        this.milkAmount = milkAmount;
    }
}

class Grid {
    constructor(name, bgColor, itemBgColor, itemColor, itemList) {
        this.name = name;
        this.bgColor = bgColor;
        this.itemBgColor = itemBgColor;
        this.itemColor = itemColor;
        this.itemList = itemList;
    }
    // En la clase Grid, modifica el método createGrid:
    createGrid(setupFavoriteButtonFunc = null) {
        main.innerHTML = '';
        const gridContainer = document.createElement('div')
        const gridTittle = document.createElement('h2');
        const gridTitleContainer = document.createElement('div')
        gridTitleContainer.className = 'grid-tittle-container'
        gridContainer.className = 'grid-container';
        gridTittle.textContent = this.name;
        gridTittle.style.backgroundImage = `linear-gradient(to right, ${this.bgColor}, color-mix(in srgb, ${this.itemBgColor} 90%, ${this.bgColor} 10%))`;
        gridTittle.className = 'grid-tittle';
        gridContainer.style.backgroundColor = this.bgColor;
        gridTitleContainer.appendChild(gridTittle)
        main.appendChild(gridTitleContainer);
        main.appendChild(gridContainer);

        this.itemList.forEach((item) => { 
            const itemContainer = document.createElement('div');
            const itemImgContainer = document.createElement('div');
            const itemTextContainer = document.createElement('div');
            const itemFilter = document.createElement('div');
            const itemH3 = document.createElement('h3');
            const itemH4 = document.createElement('h4');
            const itemHSpan = document.createElement('span');
            let itemFavButton = document.createElement('button');

            itemTextContainer.style.color = this.itemColor;
            itemContainer.style.backgroundColor = this.itemBgColor;
            itemFavButton.className = 'material-symbols-outlined item-fav-btn';
            itemTextContainer.className = 'item-text-container'
            itemFavButton.innerText = 'favorite';
            itemFavButton.title = 'añadir a favoritos';
            itemH3.textContent = item.name;
            itemH4.textContent = 'precio: ';
            itemHSpan.textContent = `$${item.price}`;
            itemImgContainer.style.backgroundImage = `url(${item.source})`;
            //accesibilidad web
            itemContainer.tabIndex = 0
            itemContainer.ariaLabel = item.name
            itemContainer.addEventListener('keydown', event=> {
                if (event.key === 'Enter') {
                    itemContainer.click()
                }
            })

            itemH4.appendChild(itemHSpan);
            itemFilter.appendChild(itemFavButton)
            itemTextContainer.append(itemH3, itemH4);
            itemImgContainer.appendChild(itemFilter);
            itemContainer.appendChild(itemImgContainer);
            itemContainer.appendChild(itemTextContainer);
            gridContainer.appendChild(itemContainer);

            itemFilter.className = 'item-filter';
            itemImgContainer.className = 'item-img-container';
            itemContainer.className = 'item-container';

            itemContainer.addEventListener('click', event=> {
                if (event.target.tagName !== 'SPAN') {
                    if (window.location.href.includes('okc-menu')) {
                        item.renderCardItem(okcMenuCardId)
                        return
                    }
                    item.renderCardItem(okcMainCardId)
                }
            });

            // Configurar botón de favoritos si se proporciona la función
            if (setupFavoriteButtonFunc) {
                // Determinar tipo y categoría basado en el nombre de la sección
                let itemType = 'coffee';
                let itemCategory = 'hot';

                if (this.name.includes('fríos')) {
                    itemCategory = 'cold';
                } else if (this.name.includes('Tés')) {
                    itemType = 'tea';
                    itemCategory = 'tea';
                } else if (this.name.includes('Postres')) {
                    itemType = 'dessert';
                    itemCategory = 'dessert';
                } else if (this.name.includes('Panes')) {
                    itemType = 'bread';
                    itemCategory = 'bread';
                }

                setupFavoriteButtonFunc(itemFavButton, item, itemType, itemCategory);
            }
        });
    }
}

/* FUNCIONES PARA GESTIONAR FAVORITOS DINÁMICAMENTE */

// Función para obtener todos los productos favoritos del localStorage
function getFavoriteItemsList() {
    try {
        const favoritesJSON = localStorage.getItem('oakCoffee_favorites');
        if (!favoritesJSON) return [];
        
        const favorites = JSON.parse(favoritesJSON);
        
        // Convertir los favoritos almacenados en objetos Item/Coffee
        return favorites.map(fav => {
            // Buscar en qué lista original está el producto
            let originalItem = null;
            
            // Buscar en hotCoffeeList
            originalItem = hotCoffeeList.find(item => 
                item.name.toLowerCase().replace(/\s+/g, '_') === fav.id.replace('coffee_', '')
            );
            
            if (!originalItem) {
                // Buscar en coldCoffeeList
                originalItem = coldCoffeeList.find(item => 
                    item.name.toLowerCase().replace(/\s+/g, '_') === fav.id.replace('coffee_', '')
                );
            }
            
            if (!originalItem) {
                // Buscar en teaList
                originalItem = teaList.find(item => 
                    item.name.toLowerCase().replace(/\s+/g, '_') === fav.id.replace('tea_', '')
                );
            }
            
            if (!originalItem) {
                // Buscar en dessertList
                originalItem = dessertList.find(item => 
                    item.name.toLowerCase().replace(/\s+/g, '_') === fav.id.replace('dessert_', '')
                );
            }
            
            if (!originalItem) {
                // Buscar en breadList
                originalItem = breadList.find(item => 
                    item.name.toLowerCase().replace(/\s+/g, '_') === fav.id.replace('bread_', '')
                );
            }
            
            // Si no encontramos el original, crear un Item básico
            if (!originalItem) {
                return new Item(fav.name, fav.price, fav.image);
            }
            
            return originalItem;
        });
        
    } catch (error) {
        console.error('Error al cargar favoritos:', error);
        return [];
    }
}

// Función para crear un grid de favoritos dinámico
function createFavoritesGrid(setupFavoriteButtonFunc=undefined) {
    const favoriteItems = getFavoriteItemsList();
    
    // Si no hay favoritos, mostrar mensaje
    if (favoriteItems.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-favorites-message';
        emptyMessage.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 60px; margin-bottom: 20px;">favorite</span>
            <h3>No tienes favoritos todavía</h3>
            <p>¡Agrega algunos productos a tus favoritos para verlos aquí!</p>
        `;
        emptyMessage.style.cssText = `
            text-align: center;
            padding: 60px 20px;
            color: #666;
            font-family: 'Lato', sans-serif;
        `;
        
        if (main) {
            main.innerHTML = '';
            main.appendChild(emptyMessage);
        }
        return;
    }
    
    // Crear grid normal con los favoritos
    const favoritesGrid = new Grid(
        'Tus Favoritos',
        '#000000ff', // Color negro para favoritos
        '#dda900ff',
        '#0c0036ff',
        favoriteItems
    );
    if (setupFavoriteButtonFunc) {
        favoritesGrid.createGrid(setupFavoriteButtonFunc);
    }
}

const mostPopularCoffeesList= [
    new Coffee('Espresso', 4, 'okc-imgs/hotCoffeeList-imgs/esspresso.jpg' ),
    new Coffee('Café con leche', 4, 'okc-imgs/hotCoffeeList-imgs/cafe-latte.jpg' ),
    new Coffee('Americano', 2, 'okc-imgs/hotCoffeeList-imgs/americano.webp' ),
    new Coffee('Capuchino', 4, 'okc-imgs/hotCoffeeList-imgs/cappuccino.jpg' ),
    new Coffee('Moca', 5, 'okc-imgs/hotCoffeeList-imgs/moka.png' ),
    new Coffee('Flat white', 4, 'okc-imgs/hotCoffeeList-imgs/flat-white.webp' ),
    new Coffee('Macchiato', 3, 'okc-imgs/hotCoffeeList-imgs/espreso-machiato.jpg' ),
    new Coffee('Cortado', 2, 'okc-imgs/hotCoffeeList-imgs/cafe-cortado.jpg' ),
    new Coffee('Café Bombón', 3, 'okc-imgs/hotCoffeeList-imgs/cafe-bombon.jpg' ),
];
const mostPopularDessertList = [
    new Item('Torta de chocolate', 5, 'okc-imgs/dessertList-imgs/torta-de-chocolate.webp'),
    new Item('Torta de quesillo de chocolate', 5, 'okc-imgs/dessertList-imgs/tortaquesillo.jfif'),
    new Item('Torta de Vainilla', 2, 'okc-imgs/dessertList-imgs/vainilla.jpeg'),
    new Item('Torta red Velvet', 5, 'okc-imgs/dessertList-imgs/red-velvet.jfif'),
    new Item('Torta de piña', 3.5, 'okc-imgs/dessertList-imgs/piña.jfif'),
    new Item('Torta negra', 3, 'okc-imgs/dessertList-imgs/negra.jfif'),
    new Item('Torta de tres leches', 5, 'okc-imgs/dessertList-imgs/tres-leches.avif'),
    new Item('Quesillo', 4, 'okc-imgs/dessertList-imgs/quesillo.jfif'),
    new Item('Torta de pan', 2, 'okc-imgs/dessertList-imgs/torta-pan.jpg'),
];
/* CAFÉS E ITEMS */
const hotCoffeeList = [
    new Coffee('Espresso', 4, 'okc-imgs/hotCoffeeList-imgs/esspresso.jpg' ),
    new Coffee('Café con leche', 4, 'okc-imgs/hotCoffeeList-imgs/cafe-latte.jpg' ),
    new Coffee('Americano', 2, 'okc-imgs/hotCoffeeList-imgs/americano.webp' ),
    new Coffee('Capuchino', 4, 'okc-imgs/hotCoffeeList-imgs/cappuccino.jpg' ),
    new Coffee('Moca', 5, 'okc-imgs/hotCoffeeList-imgs/moka.png' ),
    new Coffee('Flat white', 4, 'okc-imgs/hotCoffeeList-imgs/flat-white.webp' ),
    new Coffee('Macchiato', 3, 'okc-imgs/hotCoffeeList-imgs/espreso-machiato.jpg' ),
    new Coffee('Cortado', 2, 'okc-imgs/hotCoffeeList-imgs/cafe-cortado.jpg' ),
    new Coffee('Café Bombón', 3, 'okc-imgs/hotCoffeeList-imgs/cafe-bombon.jpg' ),
    new Coffee('Café Au Lait', 3, 'okc-imgs/hotCoffeeList-imgs/au-lait.jpg' ),
    new Coffee('Café Irlandés', 3.5, 'okc-imgs/hotCoffeeList-imgs/irish-cofe.jpg' ),
    new Coffee('Doppio', 3, 'okc-imgs/hotCoffeeList-imgs/doppio.webp' ),
    new Coffee('Café con Panna', 2.5, 'okc-imgs/hotCoffeeList-imgs/espresso-panna.jpg' ),
    new Coffee('Lungo', 3, 'okc-imgs/hotCoffeeList-imgs/lungo.webp' ),
    new Coffee('Ristretto', 3, 'okc-imgs/hotCoffeeList-imgs/Ristretto.webp' ),
    new Coffee('Café Vienés', 3.5, 'okc-imgs/hotCoffeeList-imgs/vienes.jpg' ),
    new Coffee('Marocchino', 4, 'okc-imgs/hotCoffeeList-imgs/maronchino.jpg' ),
];
const coldCoffeeList = [
    new Coffee('Iced Mocha', 5, 'okc-imgs/icedCoffeeList-imgs/cafe-iced-mocha.jpg' ),
    new Coffee('Affogato de Dulce de Leche', 3.5, 'okc-imgs/icedCoffeeList-imgs/affogato-dulce-de-leche.jpg' ),
    new Coffee('Café con Leche Frío', 2.5, 'okc-imgs/icedCoffeeList-imgs/latte-frio-.jpeg' ),
    new Coffee('Espresso Tonic', 3, 'okc-imgs/icedCoffeeList-imgs/esspresso-tonic.jpg' ),
    new Coffee('Frappé', 4, 'okc-imgs/icedCoffeeList-imgs/frappe.jpg' ),
    new Coffee('Mazagran', 2.5, 'okc-imgs/icedCoffeeList-imgs/mazagran.webp' ),
    new Coffee('Cold Brew', 2, 'okc-imgs/icedCoffeeList-imgs/cold-brew.jpg' ),
    new Coffee('Iced Caramel Macchiato', 5, 'okc-imgs/icedCoffeeList-imgs/iced-caramel-machiato.jpg' ),
    new Coffee('Nitro Cold Brew', 4, 'okc-imgs/icedCoffeeList-imgs/nitro-cold-brew.jpg' ),
];
const breadList = [
    new Item('Campesino (par)', 1.5, 'okc-imgs/breadList/campesino.jpg'),
    new Item('Bolsa de pan francés', 1, 'okc-imgs/breadList/frances.jfif'),
    new Item('Cachitos (par)', 2, 'okc-imgs/breadList/cachitos.jpeg'),
    new Item('Pan andino', 1, 'okc-imgs/breadList/andino.webp'),
    new Item('Pan de arequipe', 1, 'okc-imgs/breadList/arequipe.jfif'),
    new Item('Pan de queso', 1, 'okc-imgs/breadList/queso.jpg'),
    new Item('Bolsa de panes piñita', 1, 'okc-imgs/breadList/piñitas.jfif'),
    new Item('Bolsa de panes de mantequilla', 1, 'okc-imgs/breadList/mantequilla.jpg'),
    new Item('Bolsa de panes de coco', 1, 'okc-imgs/breadList/coco.jpg'),
    new Item('Bolsa de panes dulces', 1, 'okc-imgs/breadList/dulce.jfif'),
];
const teaList = [
    new Coffee('Té negro', 1, 'okc-imgs/teaList/te1.webp', false, null),
    new Coffee('Té Verde', 1, 'okc-imgs/teaList/verde.webp', false, null),
    new Coffee('Matcha', 2.5, 'okc-imgs/teaList/matcha.jfif', false, null),
    new Coffee('Té blanco', 1, 'okc-imgs/teaList/blanco.jpg', false, null),
    new Coffee('Oolong', 1.5, 'okc-imgs/teaList/Oolong.webp', false, null),
    new Coffee('Té rojo', 1, 'okc-imgs/teaList/rojo.jpg', false, null),
    new Coffee('Chai', 3, 'okc-imgs/teaList/chai.jfif', false, null),
    new Coffee('Manzanilla', 1, 'okc-imgs/teaList/manzanilla.avif', false, null),
];
const iceCreamList = [
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
    new Item('Helado de chocolate', 5, 'okc-imgs/helado-chocolate.jpg'),
];
const dessertList = [
    new Item('Torta de chocolate', 5, 'okc-imgs/dessertList-imgs/torta-de-chocolate.webp'),
    new Item('Torta de Vainilla', 2, 'okc-imgs/dessertList-imgs/vainilla.jpeg'),
    new Item('Torta de tres leches', 5, 'okc-imgs/dessertList-imgs/tres-leches.avif'),
    new Item('Quesillo', 4, 'okc-imgs/dessertList-imgs/quesillo.jfif'),
    new Item('Torta negra', 3, 'okc-imgs/dessertList-imgs/negra.jfif'),
    new Item('Torta de piña', 3.5, 'okc-imgs/dessertList-imgs/piña.jfif'),
    new Item('Torta de pan', 2, 'okc-imgs/dessertList-imgs/torta-pan.jpg'),
    new Item('Torta de quesillo de chocolate', 5, 'okc-imgs/dessertList-imgs/tortaquesillo.jfif'),
    new Item('Torta de zanahoria', 5, 'okc-imgs/dessertList-imgs/zanahoria.jfif'),
    new Item('Torta red Velvet', 5, 'okc-imgs/dessertList-imgs/red-velvet.jfif'),
];
const gridList = [
    new Grid('Cafés calientes', '#752004', '#221403', '#fcd596', hotCoffeeList),
    new Grid('Cafés fríos', '#9A99BE', '#161946ff', '#e6edffff', coldCoffeeList),
    new Grid('Tés', '#851037ff', '#0f041aff', '#e6edffff', teaList),
    new Grid('Postres', '#10a578ff', '#fcd596','#221403', dessertList),
    new Grid('Panes', '#cc7340ff', '#413226ff', '#ffe1cfff', breadList),
    // Grid de favoritos se manejará dinámicamente
];

/* la funcion para administrar los favoritos ira aqui similar a comomo funciona el ajuste del tema */
/** * GESTOR DE TEMAS */
function renderThemeButton(nav, onAside= false) {
    const currentTheme = loadTheme()
    const themeButton = document.createElement('button')
    const themeButtonIcon = document.createElement('span')
    themeButtonIcon.className = 'material-symbols-outlined'
    if (currentTheme === 'light') {
        themeButtonIcon.textContent = 'sunny'
        themeButton.ariaLabel = 'cambiar tema, el tema actual es claro'
    } else if (currentTheme === 'dark') {
        themeButtonIcon.textContent = 'brightness_2'
        themeButton.ariaLabel = 'cambiar tema, el tema actual es oscuro'
    } else {
        console.error('error al renderizar el boton')
    }
    themeButton.className ='theme-btn'
    themeButton.appendChild(themeButtonIcon)
    if (onAside) {
        themeButton.classList.add('on-aside')
        themeButton.style.margin = '0 5px'
        //inserta el boton al lado del contenedo del logo
        nav.previousElementSibling.previousElementSibling.insertBefore(themeButton, nav.previousElementSibling.previousElementSibling.firstChild)
        themeButton.classList.add('aside-theme-button')
    } else {
        nav.appendChild(themeButton)
        themeButton.classList.add('theme-button')
        themeButton.tabIndex = '-1'
    }
}

function loadTheme() {
    let currentTheme = localStorage.getItem('theme')
    if (!currentTheme) {
        return 'light'
    }
    return currentTheme
}
function saveTheme(newTheme) {
    localStorage.setItem('theme', newTheme)
}
const updateTheme = (themeButton, mainContainer) =>{
    const currentTheme = loadTheme()
    if (currentTheme === 'light') {
        themeButton.firstChild.textContent = 'brightness_2'
        themeButton.ariaLabel = 'cambiar tema, el tema actual es oscuro'
        saveTheme('dark')
    } else if (currentTheme === 'dark') {
        themeButton.firstChild.textContent = 'sunny'
        saveTheme('light')
        mainContainer.classList.remove('dark')
        themeButton.ariaLabel = 'cambiar tema, el tema actual es claro'
    } else {
        console.error('error al recibir tema en updateTheme')
    }
    applyTheme(mainContainer)
    return currentTheme
}
function applyTheme(mainContainer) {
    const currentTheme = loadTheme()
    if (currentTheme === 'light') {
        mainContainer.classList.remove('dark')
    } else if (currentTheme === 'dark') {
        mainContainer.classList.add('dark')
    } else {
        console.error('error al recibir tema en applyTheme')
    }
    console.log(currentTheme)
    return currentTheme
}

// Función modificada para manejar favoritos dinámicamente
function displayGrid(button, asideNavChildNodes, setupFavoriteButtonFunc) { 
    const buttonSectionId = button.getAttribute('sectionId');
    
    asideNavChildNodes.forEach(element => {
        element.classList.toggle('section-selected', false);
    });
    button.classList.add('section-selected');

    try {
        if (buttonSectionId == 6) {
            // Pasa la función aquí también
            createFavoritesGrid(setupFavoriteButtonFunc); 
            return;
        }
        
        const grid = gridList[buttonSectionId - 1];
        // ESENCIAL: Pasa la función al crear el grid
        return grid.createGrid(setupFavoriteButtonFunc); 
    } catch (error) {
        console.error('Error al encontrar el grid especificado: ' + error);
    }
}

export {
    gridList,
    mostPopularCoffeesList,
    mostPopularDessertList,
    renderThemeButton,
    loadTheme,
    saveTheme,
    updateTheme,
    displayGrid,
    applyTheme,
    Coffee, 
    Item,
    createFavoritesGrid,
    getFavoriteItemsList,
    hotCoffeeList,
    coldCoffeeList,
    teaList,
    dessertList,
    breadList,
    iceCreamList
};