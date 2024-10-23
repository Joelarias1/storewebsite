
// Cargo de DOM completo
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    const formInputs = {
        fullName: document.getElementById('fullName'),
        username: document.getElementById('username'),
        email: document.getElementById('email'),
        birthdate: document.getElementById('birthdate'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword'),
        address: document.getElementById('address')
    };

    const validations = {
        // Validar Email
        validateEmail: (email) => {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,6}$/;
            return {
                isValid: emailRegex.test(email),
                message: 'Please enter a valid email address (example: user@domain.com)'
            };
        },

        // Validar Password
        validatePassword: (password) => {
            const minLength = 6;
            const maxLength = 18;
            const hasNumber = /\d/.test(password);
            const hasUpperCase = /[A-Z]/.test(password);
            
            if (password.length < minLength) {
                return {
                    isValid: false,
                    message: 'Password must be at least 6 characters long'
                };
            }
            
            if (password.length > maxLength) {
                return {
                    isValid: false,
                    message: 'Password must be less than 18 characters'
                };
            }
            
            if (!hasNumber) {
                return {
                    isValid: false,
                    message: 'Password must contain at least one number'
                };
            }
            
            if (!hasUpperCase) {
                return {
                    isValid: false,
                    message: 'Password must contain at least one uppercase letter'
                };
            }
      
            return {
                isValid: true,
                message: 'Password meets all criteria'
            };
        },

        // Validar password igual
        validatePasswordMatch: (password, confirmPassword) => {
            return {
                isValid: password === confirmPassword,
                message: 'Passwords do not match'
            };
        },

        // Validar Edad
        validateAge: (birthdate) => {
            const today = new Date();
            const birthDate = new Date(birthdate);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            return {
                isValid: age >= 13,
                message: 'You must be at least 13 years old to register'
            };
        }
    };



    // Funciones Auxiliares
    function showError(input, message) {
        const parentDiv = input.closest('.mb-2');
        const prevMessage = parentDiv.querySelector('.alert');
        if (prevMessage) {
            prevMessage.remove();
        }
    
        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert alert-danger mt-1 small';
        messageDiv.textContent = message;
        parentDiv.appendChild(messageDiv);
    
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    function showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.textContent = 'Registration successful!';
        registerForm.insertBefore(successDiv, registerForm.firstChild);
        setTimeout(() => {
            successDiv.remove();
            registerForm.reset();
            clearMessages();
        }, 3000);
    }

    function clearMessages() {
        document.querySelectorAll('.alert').forEach(msg => msg.remove());
    }


    // Eventos - Submit
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearMessages(); 
        
        // Validar email
        const emailResult = validations.validateEmail(formInputs.email.value);
        if (!emailResult.isValid) {
            showError(formInputs.email, emailResult.message);
            return;
        }

        // Validar edad
        const ageResult = validations.validateAge(formInputs.birthdate.value);
        if (!ageResult.isValid) {
            showError(formInputs.birthdate, ageResult.message);
            return;
        }

        // Validar password
        const passwordResult = validations.validatePassword(formInputs.password.value);
        if (!passwordResult.isValid) {
            showError(formInputs.password, passwordResult.message);
            return;
        }

        // Validar que las contraseñas coincidan
        const passwordMatchResult = validations.validatePasswordMatch(
            formInputs.password.value,
            formInputs.confirmPassword.value
        );
        if (!passwordMatchResult.isValid) {
            showError(formInputs.confirmPassword, passwordMatchResult.message);
            return;
        }

        // Todo válido
        showSuccess();
    });

    // Evento Clear Form
    registerForm.addEventListener('reset', function() {
        clearMessages();
    });

});