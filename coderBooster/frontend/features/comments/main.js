import { getComments, createComment, updateComment, deleteComment } from './comments.js';

// Usuario y video reales desde localStorage
const currentUserId = JSON.parse(localStorage.getItem("user"))?.id_user;
const currentVideoId = 1; // Por ahora hardcodeado, se puede hacer dinámico después

// Bandera para evitar inicializaciones múltiples
let isInitialized = false;

export function initComments() {
  // Evitar inicializaciones múltiples
  if (isInitialized) {
    console.log('⚠️ Sistema de comentarios ya inicializado, saltando...');
    return;
  }

  // Verificar que el usuario esté logueado
  if (!currentUserId) {
    console.error('Usuario no logueado, no se pueden cargar comentarios');
    return;
  }

  console.log('Usuario logueado con ID:', currentUserId);

  // Referencias a los elementos del DOM dentro de videoplayer.html, ya cargados
  const listaComentarios = document.getElementById('listaComentarios');
  const textareaComentario = document.getElementById('nuevoComentario');
  const btnPublicar = document.getElementById('btnPublicar');

  if (!listaComentarios || !textareaComentario || !btnPublicar) {
    console.error('Elementos de comentarios no encontrados en el DOM');
    return;
  }

  async function cargarComentarios() {
    try {
      const comentarios = await getComments(currentVideoId);
      listaComentarios.innerHTML = '';
      comentarios.forEach(({ id_comment, id_user, nickname, comments }) => {
        const div = crearComentarioElement(id_comment, id_user, nickname, comments);
        listaComentarios.appendChild(div);
      });
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    }
  }

  function crearComentarioElement(id_comment, id_user, nickname, comments) {
    const div = document.createElement('div');
    div.className = 'comentario';

    const nombreElem = document.createElement('div');
    nombreElem.className = 'nombre';
    nombreElem.textContent = nickname;

    const textoElem = document.createElement('div');
    textoElem.className = 'texto';
    textoElem.textContent = comments;

    const botonesDiv = document.createElement('div');
    botonesDiv.className = 'botonesComentario';

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';

    const btnBorrar = document.createElement('button');
    btnBorrar.textContent = 'Borrar';

    if (id_user === currentUserId) {
      btnEditar.onclick = () => editarComentario(div, id_comment, textoElem, btnEditar);
      btnBorrar.onclick = () => borrarComentario(div, id_comment);
    } else {
      btnEditar.disabled = true;
      btnBorrar.disabled = true;
    }

    botonesDiv.appendChild(btnEditar);
    botonesDiv.appendChild(btnBorrar);

    div.appendChild(nombreElem);
    div.appendChild(textoElem);
    div.appendChild(botonesDiv);

    return div;
  }

  async function agregarComentario() {
    const comments = textareaComentario.value.trim();
    if (!comments) {
      alert('El comentario no puede estar vacío');
      return;
    }

    try {
      const nuevoComentario = await createComment({
        id_user: currentUserId,
        id_video: currentVideoId,
        comments,
      });

      const div = crearComentarioElement(
        nuevoComentario.id_comment,
        nuevoComentario.id_user,
        nuevoComentario.nickname,
        nuevoComentario.comments
      );

      listaComentarios.prepend(div);
      textareaComentario.value = '';
    } catch (error) {
      alert('Error al agregar comentario');
      console.error(error);
    }
  }

  async function borrarComentario(div, id_comment) {
    if (!confirm('¿Seguro que quieres borrar este comentario?')) return;

    try {
      const result = await deleteComment(id_comment, currentUserId);
      if (result) {
        div.remove();
      } else {
        alert('No se pudo borrar el comentario');
      }
    } catch (error) {
      alert('Error al borrar comentario');
      console.error(error);
    }
  }

  function editarComentario(div, id_comment, textoElem, btnEditar) {
    if (btnEditar.textContent === 'Editar') {
      const inputTextoEdit = document.createElement('textarea');
      inputTextoEdit.value = textoElem.textContent;
      inputTextoEdit.style.width = '100%';
      inputTextoEdit.style.marginTop = '5px';

      div.replaceChild(inputTextoEdit, textoElem);
      btnEditar.textContent = 'Guardar';

      btnEditar.onclick = async () => {
        const nuevoTexto = inputTextoEdit.value.trim();
        if (!nuevoTexto) {
          alert('El comentario no puede estar vacío');
          return;
        }

        try {
          await updateComment(id_comment, {
            id_user: currentUserId,
            comments: nuevoTexto,
          });

          textoElem.textContent = nuevoTexto;
          div.replaceChild(textoElem, inputTextoEdit);
          btnEditar.textContent = 'Editar';
          btnEditar.onclick = () => editarComentario(div, id_comment, textoElem, btnEditar);
        } catch (error) {
          alert('Error al guardar comentario');
          console.error(error);
        }
      };
    }
  }

  btnPublicar.addEventListener('click', agregarComentario);

  // Carga inicial de comentarios
  cargarComentarios();

  // Marcar como inicializado para evitar duplicados
  isInitialized = true;
  console.log('✅ Sistema de comentarios inicializado completamente');
}
