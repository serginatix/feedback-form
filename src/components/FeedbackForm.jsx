import { useState } from "react";
import "./FeedbackForm.css";

function FeedbackForm() {
  // 1. Состояния полей
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Задание 2: Телефон
  const [message, setMessage] = useState("");
  const [needResponse, setNeedResponse] = useState(false); // Задание 3: Чекбокс

  // 2. Состояние ошибок
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    phone: null,
    message: null,
  });

  // 3. Состояние затронутых полей (touched)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  // 4. Состояние отправки
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Задание 2: Маска номера телефона +7 (XXX) XXX-XX-XX ---
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    let phoneNumber = digits;

    if (phoneNumber.startsWith("7") || phoneNumber.startsWith("8")) {
      phoneNumber = phoneNumber.slice(1);
    }
    phoneNumber = phoneNumber.slice(0, 10);

    if (phoneNumber.length === 0) return "";

    let formatted = "+7 (";
    if (phoneNumber.length > 0) formatted += phoneNumber.slice(0, 3);
    if (phoneNumber.length >= 3) formatted += ") ";
    if (phoneNumber.length > 3) formatted += phoneNumber.slice(3, 6);
    if (phoneNumber.length >= 6) formatted += "-";
    if (phoneNumber.length > 6) formatted += phoneNumber.slice(6, 8);
    if (phoneNumber.length >= 8) formatted += "-";
    if (phoneNumber.length > 8) formatted += phoneNumber.slice(8, 10);

    return formatted;
  };

  // --- Валидация полей ---
  const validateName = (val) => {
    if (!val.trim()) return "Имя обязательно для заполнения";
    if (val.trim().length < 2) return "Минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(val.trim()))
      return "Только буквы, пробелы и дефис";
    return null;
  };

  // Задание 3: Обязательность Email зависит от чекбокса
  const validateEmail = (val, isRequired) => {
    if (!val.trim()) {
      return isRequired ? "Email обязателен для получения ответа" : null;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()))
      return "Некорректный формат email";
    return null;
  };

  const validatePhone = (val) => {
    if (!val.trim()) return null;
    if (val.length < 18) return "Введите полный номер: +7 (XXX) XXX-XX-XX";
    return null;
  };

  // Задание 1: Ограничение длины сообщения 500 символов
  const validateMessage = (val) => {
    if (!val.trim()) return "Сообщение обязательно для заполнения";
    if (val.trim().length < 10) return "Минимум 10 символов";
    if (val.length > 500) return "Максимум 500 символов";
    return null;
  };

  // --- Обработчики ввода ---
  const handleChange = (field, value) => {
    let newValue = value;

    if (field === "name") setName(newValue);
    if (field === "email") setEmail(newValue);
    if (field === "phone") {
      newValue = formatPhoneNumber(value);
      setPhone(newValue);
    }
    if (field === "message") setMessage(newValue);

    if (touched[field]) {
      let err = null;
      if (field === "name") err = validateName(newValue);
      if (field === "email") err = validateEmail(newValue, needResponse);
      if (field === "phone") err = validatePhone(newValue);
      if (field === "message") err = validateMessage(newValue);

      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  // Обработчик переключения чекбокса
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setNeedResponse(checked);

    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(email, checked),
      }));
    }
  };

  // Обработчик потери фокуса
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let err = null;
    if (field === "name") err = validateName(name);
    if (field === "email") err = validateEmail(email, needResponse);
    if (field === "phone") err = validatePhone(phone);
    if (field === "message") err = validateMessage(message);

    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email, needResponse),
      phone: validatePhone(phone),
      message: validateMessage(message),
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.values(newErrors).some((err) => err !== null)) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  // Получение CSS-классов состояния поля
  const getInputClass = (field) => {
    const classes = ["field__input"];
    if (touched[field] && errors[field]) {
      classes.push("field__input--error");
    } else if (touched[field] && !errors[field] && (field !== "phone" || phone)) {
      classes.push("field__input--valid");
    }

    if (field === "message") {
      classes.push("field__input--textarea");
    }

    return classes.join(" ");
  };

  // Экран успешной отправки
  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">
          Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
            setNeedResponse(false);
            setErrors({ name: null, email: null, phone: null, message: null });
            setTouched({ name: false, email: false, phone: false, message: false });
            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      {/* Поле «Имя» */}
      <div className="field">
        <label htmlFor="name" className="field__label">Имя</label>
        <input
          id="name"
          type="text"
          className={getInputClass("name")}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {touched.name && errors.name && (
          <span className="field__error">{errors.name}</span>
        )}
      </div>

      {/* Поле «Телефон» (Задание 2) */}
      <div className="field">
        <label htmlFor="phone" className="field__label">Телефон</label>
        <input
          id="phone"
          type="tel"
          placeholder="+7 (___) ___-__-__"
          className={getInputClass("phone")}
          value={phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
        />
        {touched.phone && errors.phone && (
          <span className="field__error">{errors.phone}</span>
        )}
      </div>

      {/* Чекбокс «Хочу получить ответ» (Задание 3) */}
      <div className="field field--checkbox">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={needResponse}
            onChange={handleCheckboxChange}
          />
          <span>Хочу получить ответ</span>
        </label>
      </div>

      {/* Поле «Email» */}
      <div className="field">
        <label htmlFor="email" className="field__label">
          Email {needResponse && <span className="required">*</span>}
        </label>
        <input
          id="email"
          type="email"
          className={getInputClass("email")}
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
        />
        {touched.email && errors.email && (
          <span className="field__error">{errors.email}</span>
        )}
      </div>

      {/* Поле «Сообщение» (Задание 1) */}
      <div className="field">
        <label htmlFor="message" className="field__label">Сообщение</label>
        <textarea
          id="message"
          className={getInputClass("message")}
          value={message}
          maxLength={500}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          rows={5}
        />
        {/* Счётчик символов */}
        <div className="char-counter">
          {message.length} / 500
        </div>
        {touched.message && errors.message && (
          <span className="field__error">{errors.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="feedback-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка…" : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;