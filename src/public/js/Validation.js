function Validator(options) { //option là 1 obj

    //Ham thuc hien validate
    function validate(inputElement, rule) {
      //lấy được value người dùng nhập vào qua inputElement.value
      //Lấy được hàm kiểm tra qua rule.test()
      var errorMessage = rule.test(inputElement.value);
      var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

      if (errorMessage) {
        errorElement.innerText = errorMessage;
        inputElement.parentElement.classList.add('invalid');
      } else {
        errorElement.innerText = '';
        inputElement.parentElement.classList.remove('invalid');
      }
    }


    //lay ra element cua form can validate
    var formElement = document.querySelector(options.form);

    if (formElement) {
      options.rules.forEach(rule => {
        var inputElement = formElement.querySelector(rule.selector); // lấy ra từng element để bắt sự kiện

        if (inputElement) {
          inputElement.onblur = () => {

            validate(inputElement, rule);
          }

          inputElement.oninput = () => {
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
          }
        }

      });
    }

  }

  Validator.isRequired = function (selector, message) {
    return {
      selector: selector,
      test: function (value) {
        return value.trim() ? undefined : message
      }
    }
  }

  Validator.minLength = function (selector, min, message) {
    return {
      selector: selector,
      test: function (value) {
        return value.length >= min ? undefined : message || `Nhập tối thiểu ${min} kí tự`;
      }
    }
  }
