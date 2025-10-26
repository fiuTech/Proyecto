const API_BASE = 'http://localhost:3000';
let token = localStorage.getItem('token');
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
  setupEventListeners();
});

async function checkAuth() {
  if (token) {
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        currentUser = await response.json();
        showAuthenticatedView();
      } else {
        throw new Error('Token inválido');
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      localStorage.removeItem('token');
      token = null;
      showLoginView();
    }
  } else {
    showLoginView();
  }
}

function showLoginView() {
  document.getElementById('authSection').classList.remove('d-none');
  document.getElementById('petsSection').classList.add('d-none');
  document.getElementById('btnLogin').classList.remove('d-none');
  document.getElementById('userSection').classList.add('d-none');
}

function showAuthenticatedView() {
  document.getElementById('authSection').classList.add('d-none');
  document.getElementById('petsSection').classList.remove('d-none');
  document.getElementById('btnLogin').classList.add('d-none');
  document.getElementById('userSection').classList.remove('d-none');
  
  if (currentUser) {
    document.getElementById('userName').textContent = currentUser.fullname || currentUser.username;
    document.getElementById('userAvatar').textContent = (currentUser.fullname || currentUser.username).charAt(0).toUpperCase();
  }
  
  loadPets();
}

function setupEventListeners() {
  // Login
  document.getElementById('formLogin').addEventListener('submit', async function(e) {
    e.preventDefault();
    await handleLogin();
  });

  // Registro
  document.getElementById('formRegister').addEventListener('submit', async function(e) {
    e.preventDefault();
    await handleRegister();
  });

  // Publicar mascota
  document.getElementById('formPet').addEventListener('submit', async function(e) {
    e.preventDefault();
    await handleCreatePet();
  });

  // Perfil
  document.getElementById('btnProfile').addEventListener('click', function(e) {
    e.preventDefault();
    loadProfile();
    new bootstrap.Modal(document.getElementById('profileModal')).show();
  });

  // Cerrar sesión
  document.getElementById('btnLogout').addEventListener('click', function(e) {
    e.preventDefault();
    handleLogout();
  });

  // Filtros
  document.getElementById('btnBuscar').addEventListener('click', function() {
    loadPets();
  });

  document.getElementById('btnRefresh').addEventListener('click', function() {
    loadPets();
  });

  // Filtros en tiempo real
  ['fMode', 'fType'].forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
      loadPets();
    });
  });
}

async function handleLogin() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
    alert('Por favor completa todos los campos');
    return;
  }

  // Mostrar loading
  document.getElementById('loginText').classList.add('d-none');
  document.getElementById('loginLoading').classList.remove('d-none');

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      token = data.token;
      currentUser = data.user;
      localStorage.setItem('token', token);
      showAuthenticatedView();
      alert('¡Login exitoso!');
    } else {
      alert(data.message || 'Error en login');
    }
  } catch (error) {
    console.error('Error en login:', error);
    alert('Error de conexión');
  } finally {
    // Ocultar loading
    document.getElementById('loginText').classList.remove('d-none');
    document.getElementById('loginLoading').classList.add('d-none');
  }
}

async function handleRegister() {
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const fullname = document.getElementById('regFullname').value;
  const password = document.getElementById('regPassword').value;

  if (!username || !email || !fullname || !password) {
    alert('Por favor completa todos los campos');
    return;
  }

  if (password.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  // Mostrar loading
  document.getElementById('registerText').classList.add('d-none');
  document.getElementById('registerLoading').classList.remove('d-none');

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, fullname, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      document.getElementById('formRegister').reset();
    } else {
      alert(data.message || 'Error en registro');
    }
  } catch (error) {
    console.error('Error en registro:', error);
    alert('Error de conexión');
  } finally {
    // Ocultar loading
    document.getElementById('registerText').classList.remove('d-none');
    document.getElementById('registerLoading').classList.add('d-none');
  }
}

async function loadPets() {
  try {
    const filters = {
      mode: document.getElementById('fMode').value,
      type: document.getElementById('fType').value,
      city: document.getElementById('fCity').value,
      q: document.getElementById('fQ').value
    };

    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await fetch(`${API_BASE}/pets?${queryParams}`);
    const data = await response.json();

    if (response.ok) {
      displayPets(data.data);
    } else {
      throw new Error(data.message || 'Error cargando mascotas');
    }
  } catch (error) {
    console.error('Error cargando mascotas:', error);
    document.getElementById('petsList').innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h5>Error al cargar</h5>
          <p>No se pudieron cargar las mascotas.</p>
          <button class="btn btn-primary" onclick="loadPets()">Reintentar</button>
        </div>
      </div>
    `;
  }
}

function displayPets(pets) {
  const container = document.getElementById('petsList');
  
  if (!pets || pets.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <i class="fas fa-paw"></i>
          <h5>No hay mascotas</h5>
          <p>No se encontraron mascotas que coincidan con tus criterios.</p>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#petModal">Publicar una mascota</button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = pets.map(pet => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card pet-card h-100">
        <img src="${pet.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=250&fit=crop'}" 
             class="card-img-top" alt="${pet.name}">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title">${pet.name}</h5>
            <span class="badge ${getBadgeClass(pet.mode)}">${getModeText(pet.mode)}</span>
          </div>
          <div class="mb-2">
            <span class="badge bg-light text-dark me-1">
              <i class="fas fa-${pet.type === 'perro' ? 'dog' : pet.type === 'gato' ? 'cat' : 'paw'} me-1"></i>
              ${pet.type}
            </span>
            <span class="badge bg-light text-dark">
              <i class="fas fa-map-marker-alt me-1"></i>
              ${pet.city}
            </span>
          </div>
          <p class="card-text flex-grow-1">${pet.description || 'Sin descripción'}</p>
          <div class="mt-auto">
            <small class="text-muted">
              <i class="fas fa-envelope me-1"></i>${pet.owner_email}
            </small>
            ${pet.age ? `<br><small class="text-muted"><i class="fas fa-birthday-cake me-1"></i>${pet.age} año${pet.age !== 1 ? 's' : ''}</small>` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function getBadgeClass(mode) {
  const classes = {
    'adoption': 'badge-adoption',
    'lost': 'badge-lost',
    'found': 'badge-found'
  };
  return classes[mode] || 'bg-secondary';
}

function getModeText(mode) {
  const texts = {
    'adoption': 'En adopción',
    'lost': 'Perdida',
    'found': 'Encontrada'
  };
  return texts[mode] || mode;
}

async function handleCreatePet() {
  const petData = {
    name: document.getElementById('petName').value,
    type: document.getElementById('petType').value,
    mode: document.getElementById('petMode').value,
    city: document.getElementById('petCity').value,
    age: document.getElementById('petAge').value ? parseInt(document.getElementById('petAge').value) : undefined,
    size: document.getElementById('petSize').value || undefined,
    description: document.getElementById('petDescription').value || undefined,
    photo: document.getElementById('petPhoto').value || undefined,
    owner_email: currentUser?.email || 'anonimo@example.com'
  };

  // Validación básica
  if (!petData.name || !petData.type || !petData.mode || !petData.city) {
    alert('Por favor completa los campos obligatorios (*)');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(petData)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Mascota publicada exitosamente!');
      document.getElementById('formPet').reset();
      bootstrap.Modal.getInstance(document.getElementById('petModal')).hide();
      loadPets();
    } else {
      alert(data.message || 'Error publicando mascota');
    }
  } catch (error) {
    console.error('Error publicando mascota:', error);
    alert('Error de conexión');
  }
}

function loadProfile() {
  if (!currentUser) return;
  
  document.getElementById('profPhone').value = currentUser.phone || '';
  document.getElementById('profCity').value = currentUser.city || '';
  document.getElementById('profBio').value = currentUser.bio || '';
}

function handleLogout() {
  localStorage.removeItem('token');
  token = null;
  currentUser = null;
  showLoginView();
  alert('Sesión cerrada correctamente');
}