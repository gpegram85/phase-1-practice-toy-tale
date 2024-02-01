let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  addToyToBox()
});

function getToys() {
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(toyData => {
    const toyBox = document.getElementById('toy-collection')

    toyData.forEach(toy => {
      const toyImgCard = document.createElement('div')
      const toyImg = document.createElement('img')
      const toyName = document.createElement('h2')
      const toyLikes = document.createElement('p')
      const toyLikeBtn = document.createElement('button')

      toyName.textContent = toy.name
      toyImg.src = toy.image

      toyImg.classList.add('toy-avatar')
      toyImgCard.classList.add('card')

      toyLikes.textContent = toy.likes + ' Likes'
      toyLikes.classList.add(`like-counter`)
      toyLikes.id = `like-counter-${toy.id}`

      toyLikeBtn.addEventListener('click', () => handleLike(toy))
      toyLikeBtn.classList.add('like-btn')
      toyLikeBtn.innerText = 'Like ❤️'

      toyImgCard.appendChild(toyName)
      toyImgCard.appendChild(toyImg)
      toyImgCard.appendChild(toyLikes)
      toyImgCard.appendChild(toyLikeBtn)
      toyBox.appendChild(toyImgCard)
    });
  })
}

getToys()

function handleLike(toy) {
const newNumberOfLikes = (toy.likes + 1)

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
    "likes": newNumberOfLikes
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update like count')
    }
    return response.json()
  })
  .then(updatedToy => {
    const toyId = updatedToy.id;
    const updatedToyLikes = document.getElementById(`like-counter-${toyId}`);
    updatedToyLikes.textContent = updatedToy.likes + ' Likes'
  })
  .catch(error => {
    console.log(error)
  })
}

function addToyToBox() {
  const createToyBtn = document.querySelector('.submit')
  createToyBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const toyNameInput = document.querySelector('.input-text[name="name"]')
    const toyImgInput = document.querySelector('.input-text[name="image"]')

    const newToyName = toyNameInput.value
    const newToyImg = toyImgInput.value

    fetch('http://localhost:3000/toys/', {
      method : 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": newToyName,
        "image": newToyImg,
        "likes": 0
      })
    })
    .then(response => {
      if(response.ok) {
        toyNameInput.value = ""
        toyImgInput.value = ""
        location.reload()
      } else {
        throw new Error('Failed to add toy: ' + response.statusText)
      }
    })
    .catch(error => {
      alert('Error adding toy: ', error)
    })
  })
}