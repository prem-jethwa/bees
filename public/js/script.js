// const submitBtn = document.querySelector('form[type="submit"]');
// const form = document.querySelector('form');

const main = document.querySelector('main');
const nav = document.querySelector('nav');
let isDescFull = {};
let allDesc = {};

const moreEl = [...document.querySelectorAll('.more')];

const getTaskId = el => {
  return el.closest('.task-container').querySelector('.id').textContent.replace('#', '');
};

const lessDesc = el => {
  const taskId = getTaskId(el);
  const descEl = el.closest('.desc');
  const desc = descEl.querySelector('p').textContent.trim();

  const descLength = desc.replaceAll(' ', '').length;
  if (descLength < 50) return;

  descEl.querySelector('p').textContent = `${desc.slice(0, 20 - descLength)}...`;
  allDesc[+taskId] = desc.trim();
  isDescFull[+taskId] = false;
  el.textContent = 'more';
};

if (moreEl) {
  moreEl.map(el => lessDesc(el));
}

main.addEventListener('click', async e => {
  const moreEl = e.target.closest('.more');
  if (moreEl) {
    const descEl = e.target.closest('.desc');
    const taskId = getTaskId(moreEl);

    if (!isDescFull[taskId]) {
      if (!allDesc[taskId]) return;

      descEl.querySelector('p').textContent = allDesc[taskId];
      moreEl.textContent = 'less';

      return (isDescFull[+taskId] = true);
    }

    if (isDescFull[taskId]) lessDesc(moreEl);
  }

  //
  const remove = e.target.closest('.remove');

  if (!remove) return;

  const url = e.target.dataset.url;

  await fetch(url, {
    method: 'DELETE',
  });

  window.location.href = 'http://localhost:3000';
});

// TRASH
// if (!remove) return;
// const id = e.target.closest('.task-container').querySelector('.id').innerText.replace('#', '');

// await fetch(`http://localhost:3000/remove/${id}`, {
//   method: 'DELETE',
// });

// const data = {
//   title,
//   id,
// };
// const formData = new FormData();
// formData.append('title', title);
// formData.append('id', id);

// await fetch('http://localhost:3000/remove/:', {
//   method: 'DELETE',
//   body: formData,
// });

// console.log(submitBtn, form);

// console.log(form.action);

// form.addEventListener('submit', async e => {
//   e.preventDefault();

//   const formData = new FormData(form);

//   console.log(Object.values(form));
// });
