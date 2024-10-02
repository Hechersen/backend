document.addEventListener('DOMContentLoaded', () => {
  // Manejar el cambio de rol
  document.querySelectorAll('.role-select').forEach(select => {
    select.addEventListener('change', async (event) => {
      const userId = event.target.dataset.userId;
      const newRole = event.target.value;

      try {
        const response = await fetch(`/users/${userId}/role`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ role: newRole })
        });

        if (response.ok) {
          alert('Rol actualizado correctamente');
        } else {
          alert('Error al actualizar el rol');
        }
      } catch (error) {
        console.error('Error al cambiar el rol:', error);
        alert('Error al cambiar el rol');
      }
    });
  });

  // Manejar la eliminación de usuario
  document.querySelectorAll('.deleteUserButton').forEach(button => {
    button.addEventListener('click', async (event) => {
      const userId = event.target.dataset.userId;

      try {
        const response = await fetch(`/users/${userId}/delete`, {
          method: 'POST'
        });

        console.log(response);

        if (response.ok) {
          const responseData = await response.json();
          alert(responseData.message);
          location.reload();
        } else {
          const errorData = await response.json();
          alert(`Error al eliminar el usuario: ${errorData.error || 'Error desconocido'}`);
        }
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        alert('Error al eliminar el usuario');
      }
    });
  });
});
