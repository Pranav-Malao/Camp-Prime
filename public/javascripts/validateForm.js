(function () {
    'use strict'
    
    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            setTimeout(() => {
              form.classList.add('was-validated')
          }, 500);
        }, false)
      })
  })()