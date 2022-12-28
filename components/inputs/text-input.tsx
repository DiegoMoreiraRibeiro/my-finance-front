function TextInput(props: any) {
  const { placeholder, id, value, handleChangeTextInput, type, required } =
    props;

  function change(value: string) {
    return handleChangeTextInput(value);
  }

  return (
    <input
      id={id}
      placeholder={placeholder}
      type={type}
      className={"input-text-custom"}
      value={value}
      required={required ?? false}
      onChange={(e) => {
        change(e.target.value);
      }}
    />
  );
}

export default TextInput;
