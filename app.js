//Storage Controller




//Item Controller
const ItemCtrl = (() => {
    // Item constructor

    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories
    }

    //Data Structure

    const data = {
        items: [],
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function () {
            return data.items
        },
        addItem: function (name, calories) {
            let ID;
            //Create the ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }


            //Calories to number
            calories = parseInt(calories);

            //Create new item
            newItem = new Item(ID, name, calories);

            //add to the items array
            data.items.push(newItem)

            return newItem
        },
        updateItem: function (name, calories) {
            calories = parseInt(calories);

            let found = null;

            data.items.forEach((item) => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        getItemById: function (id) {
            let found = null;
            data.items.forEach((item) => {
                if (item.id === id) {
                    found = item;
                }
            })
            return found;
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let total = 0;

            data.items.forEach((item) => {
                total += item.calories
            })

            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: function () {
            return data;
        }
    }
})();




//UI Controller 
const UICtrl = (() => {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        listItems: '#item-list li',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    return {
        populateItemList: function (items) {
            let html = '';

            items.forEach((item) => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                     <a href="#" class="secondary-content">
                         <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `;
            });

            //insert list items

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        getSelectors: function () {
            return UISelectors;
        },
        addListItem: function (item) {
            //Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block'
            //Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';

            //add ID
            li.id = `item-${item.id}`

            //Add html
            li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
           </a>
            `;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach((listItem) => {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}</strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                         <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;

                    const totalCalories = ItemCtrl.getTotalCalories();
                    UICtrl.showTotalCalories(totalCalories)
                }
            })
        },
        clearInputFields: function () {
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCaloriesInput).value = ''
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline'
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.addBtn).style.display = 'none'
        },
        clearEditState: function () {
            UICtrl.clearInputFields();
            document.querySelector(UISelectors.updateBtn).style.display = 'none'
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'
            document.querySelector(UISelectors.backBtn).style.display = 'none'
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
        }
    }
})();





//App Controller
const App = ((ItemCtrl, UICtrl) => {
    //Load event listeners
    const loadEventListeners = () => {
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false
            }
        })

        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)
    }

    const itemAddSubmit = (e) => {
        e.preventDefault();

        const input = UICtrl.getItemInput();

        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            UICtrl.addListItem(newItem);

            //Get Total Calories
            const totalCalories = ItemCtrl.getTotalCalories()

            UICtrl.showTotalCalories(totalCalories)

            UICtrl.clearInputFields();
        }
    }

    const itemEditClick = (e) => {

        if (e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;

            const listIdArr = listId.split('-');

            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id)

            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    const itemUpdateSubmit = (e) => {
        e.preventDefault();

        const input = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem)
    }

    return {
        init: function () {
            UICtrl.clearEditState();


            const items = ItemCtrl.getItems()

            //check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                UICtrl.populateItemList(items)
            }

            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

App.init()