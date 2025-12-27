/*
* ESTE ES EL ADMINISTRADOR DE LOS PRODUCOS FAVORITOS
*/
// LLAVE PARA ACCEDER A LOS FAVORITOS DESDE EL LOCAR STORAGE
const FAVORITES_KEY = 'oakCoffee_favorites';
// ESTRUCTURA DE UN PRODUCTO FAVORITO
class FavoriteItem {
    constructor(itemId, itemName, itemPrice, itemImage, itemType, itemCategory) {
        this.id = itemId;
        this.name = itemName;
        this.price = itemPrice;
        this.image = itemImage;
        this.type = itemType; 
        this.category = itemCategory;
        this.addedDate = new Date().toISOString(); //UN POCO OPCIONAL PERO OBTIENE DATO EN FORMATO DE NUMEROS
    }
}
function getFavorites() {
    //FUNCION QUE OBTIENE LOS PRODUCTOS FAVORITOS DEL LOCAR STORAGE
    const favoritesJSON = localStorage.getItem(FAVORITES_KEY); //ACCEDEMOS AL CONTENIDO USANDO LA CLAVE/LLAVE
    return favoritesJSON ? JSON.parse(favoritesJSON) : []; // EN CASO DE ESTAR VACIO RETORNA UN ARRAY VACIO
}

function saveFavorites(favorites) {  // FUNCION QUE GUARDA LOS FAVORITOS
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));// SE PASA EL EL ARRAY DE FAVORITOS A STRING PARA PODER ALMACENARLO
}
function isFavorite(itemId) {
    const favorites = getFavorites();
    //RETORNA UN BOOLEANO, BUSCA SI HAY COINCIDENCIAS EN LA ID DEL ITEM Y SI ESTA EN LA LISTA DE FAVORITOS RETORNA TRUE
    return favorites.some(fav => fav.id === itemId);
}

function addToFavorites(item, itemType, itemCategory) {
    try {
        //ASI ARMAMOS UN IDENTIFICADOR UNICO PARA CADA PRODUCTO
        // EJ. coofee_café_con_leche_frío
        const itemId = `${itemType}_${item.name.toLowerCase().replace(/\s+/g, '_')}`;
        
        if (isFavorite(itemId)) {
            //INDICA AL DESARROLLADOR QUE HUBO UN ERROR
            console.log(`El producto "${item.name}" ya está en favoritos`);
            return false;
        }
        // CREA UNA INSTANCIA DE UN PRODUCTO FAVORITO Y LO AGREGA A LA LISTA(lista de objetos)
        const favorites = getFavorites();
        const favoriteItem = new FavoriteItem(
            itemId,
            item.name,
            item.price,
            item.source,
            itemType,
            itemCategory
        );
        
        favorites.push(favoriteItem);
        saveFavorites(favorites);
        
        // Disparar evento personalizado para notificar cambios
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        //notifica que el producto se agrego correctamente
        console.log(`Producto "${item.name}" agregado a favoritos`);
        return true;
        
    } catch (error) {
        console.error('Error al agregar a favoritos:', error); //EN CASO DE UN ERROR
        return false;
    }
}

function removeFromFavorites(itemId) { // FUNCION QUE ELIMINA UN ITEM DE LOS FAVORITOS
    try {
        const favorites = getFavorites();
        const initialLength = favorites.length;
        
        const updatedFavorites = favorites.filter(fav => fav.id !== itemId); //SEPARA LOS DEMAS PRODUCTOS FAVORITOS DEL ELIMINADO
        
        if (updatedFavorites.length === initialLength) {
            //notifica que el producto NO se encontro
            console.log(`Producto con ID "${itemId}" no encontrado en favoritos`);
            return false;
        }
        // GUARDA LOS CAMBIOS HECHOS
        saveFavorites(updatedFavorites);
        
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));//EVENTO PERSONALIZADO PARA NOTIFICAR QUE LA LISTA SE ACTUALIZO
        
        console.log(`Producto con ID "${itemId}" eliminado de favoritos`);
        return true;
        
    } catch (error) {
        console.error('Error al eliminar de favoritos:', error); // NOTIFICA EL ERROR
        return false;
    }
}

function toggleFavorite(item, itemType, itemCategory) {
    /*
    * item es de tipo {objeto}
    * itemTyme es de tipo "string"
    * itemCategory es de tipo "string"
    */
    // arma el id ej. coofee_café_con_leche_frío
    const itemId = `${itemType}_${item.name.toLowerCase().replace(/\s+/g, '_')}`; //si tiene uno o mas espacios el espacio se remplaza por un guion bajo '_'
    //para eliminar y agregar usando el mismo boton
    if (isFavorite(itemId)) {
        removeFromFavorites(itemId);
        return false;
    } else {
        addToFavorites(item, itemType, itemCategory);
        return true;
    }
}

function getFavoritesCount() { // FUNCION UN POCO INNECESARIA POR LO CORTA QUE PERO BUENO..
    return getFavorites().length; //RETORA LA LONGITUD DE LA LISTA DE FAVORITOS
}

function clearFavorites() { // FUNCION QUE BORRA TODOS LOS PRODUCTOS FAVORITOS
    try {
        localStorage.removeItem(FAVORITES_KEY);
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        console.log('Todos los favoritos han sido eliminados');
        return true;
    } catch (error) {
        console.error('Error al limpiar favoritos:', error);
        return false;
    }
}


function getFavoritesByType(type) { //OBTIENE LOS FAVORITOS POR SU TIPO CAFE, POSTREM PANES ETC
    const favorites = getFavorites();
    return favorites.filter(fav => fav.type === type);
}

function getFavoritesByCategory(category) { // POR LA CATEGORIA, CALIENTE O FRIO
    const favorites = getFavorites();
    return favorites.filter(fav => fav.category === category);
}

function updateFavoriteButton(button, isFavorite) {
    if (!button) return;
    
    if (isFavorite) {
        button.innerHTML = 'heart_minus';
        button.style.color = '#ff4040ff'; // Color ROJIZO PARA INDICAR QUE ESTA ACTIVO
        button.title = 'Quitar de favoritos';
        button.ariaLabel = 'Quitar de favoritos'
    } else {
        button.innerHTML = 'favorite';
        button.style.color = ''; // Color por defecto
        button.title = 'Agregar a favoritos';
        button.ariaLabel = 'Agregar a favoritos'
    }
}


function setupFavoriteButton(button, item, itemType, itemCategory) {
    if ((!button || !item)) return;
    
    const itemId = `${itemType}_${item.name.toLowerCase().replace(/\s+/g, '_')}`;
    const isCurrentlyFavorite = isFavorite(itemId);
    updateFavoriteButton(button, isCurrentlyFavorite);
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    newButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const newFavoriteState = toggleFavorite(item, itemType, itemCategory);
        updateFavoriteButton(newButton, newFavoriteState);
        showFavoriteNotification(item.name, newFavoriteState);
    });
}
let notificationCounter = 0;
function showFavoriteNotification(itemName, added) {
    const notification = document.createElement('div');
    const pixels = 60
    notification.className = 'favorite-notification';
    notification.innerHTML = `
        <span class="material-symbols-outlined">${added ? 'favorite' : 'heart_minus'}</span>
        <span>${itemName} ${added ? 'agregado a' : 'eliminado de'} favoritos</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: ${(notificationCounter*pixels)+20}px;
        right: 20px;
        background: ${added ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        box-shadow: 0 4px 12px #222;
        animation: slideIn 0.3s ease;
        font-family: 'Lato', sans-serif;
    `;
    document.body.appendChild(notification);
    notificationCounter++
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
        notificationCounter--
    }, 3000);
}

function updateFavoritesCounter() {
    const count = getFavoritesCount();
    
    const headerFavButton = document.querySelector('.header-nav-item[href*="favoritos"]');
    if (headerFavButton) {
        const existingCounter = headerFavButton.querySelector('.fav-counter');
        if (existingCounter) {
            existingCounter.textContent = `(${count})`;
        } else if (count > 0) {
            const counter = document.createElement('span');
            counter.className = 'fav-counter';
            counter.textContent = `(${count})`;
            counter.style.cssText = `
                background: #ff4081;
                color: white;
                border-radius: 50%;
                padding: 2px 6px;
                font-size: 12px;
                margin-left: 5px;
            `;
            headerFavButton.appendChild(counter);
        }
    }
    
    const asideFavButton = document.querySelector('.aside-nav-item[href*="favoritos"]');
    if (asideFavButton) {
        const existingCounter = asideFavButton.querySelector('.fav-counter');
        if (existingCounter) {
            existingCounter.textContent = `(${count})`;
        } else if (count > 0) {
            const counter = document.createElement('span');
            counter.className = 'fav-counter';
            counter.textContent = `(${count})`;
            counter.style.cssText = `
                background: #ff4081;
                color: white;
                border-radius: 50%;
                padding: 2px 6px;
                font-size: 12px;
                margin-left: 5px;
            `;
            asideFavButton.appendChild(counter);
        }
    }
}

function initializeFavoriteButtons() {
    document.querySelectorAll('.product-fav-btn').forEach(button => {
        const productContainer = button.closest('.product-container, .item-container');
        if (productContainer) {
            const productName = productContainer.querySelector('h3')?.textContent;
            const productPrice = productContainer.querySelector('span')?.textContent?.replace('$', '');
            const productImg = productContainer.querySelector('.product-img-container, .item-img-container')?.style.backgroundImage;
            
            if (productName) {
                const item = {
                    name: productName,
                    price: parseFloat(productPrice) || 0,
                    source: productImg ? productImg.replace('url("', '').replace('")', '') : ''
                };
                
                let itemType = 'coffee';
                let itemCategory = 'hot';
                
                if (productContainer.closest('#dessert-container')) {
                    itemType = 'dessert';
                    itemCategory = 'dessert';
                }
                
                setupFavoriteButton(button, item, itemType, itemCategory);
            }
        }
    });
    
    updateFavoritesCounter();
}
window.addEventListener('favoritesUpdated', () => {
    updateFavoritesCounter();
    initializeFavoriteButtons();
});

document.addEventListener('DOMContentLoaded', () => {
    initializeFavoriteButtons();
    
    if (!document.querySelector('#favorite-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'favorite-styles';
        styleSheet.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .favorite-notification {
                animation: slideIn 0.3s ease;
            }
        `;
        document.head.appendChild(styleSheet);
    }
});


export {
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    getFavoritesCount,
    clearFavorites,
    getFavoritesByType,
    getFavoritesByCategory,
    setupFavoriteButton,
    updateFavoritesCounter,
    initializeFavoriteButtons
};