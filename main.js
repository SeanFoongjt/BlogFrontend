import Quill from 'quill';

const options = {
  modules: {
    toolbar: true,
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'
};

const quill = new Quill('#editor', options);
