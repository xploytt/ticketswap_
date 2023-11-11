const d = document
const uidEl = d.getElementById("uid")
const {uid} = uidEl.dataset

d.getElementById('continue-btn').addEventListener('click', ()=>location.href=`/payment/method?uid=${uid}`)
