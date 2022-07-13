let arrow = document.getElementById('arrow')
let profile = document.getElementById('profile')
let dot = document.getElementById('dot')
let edit = document.getElementById('edit')

function isClicked() {
    arrow.classList.toggle('active')
    profile.classList.toggle('active')

}

function dotClicked() {
    edit.classList.toggle('active')
}

arrow.addEventListener('click', isClicked, false)
dot.addEventListener('click', dotClicked, false)