function SelectInput(props: any) {
  const {
    placeholder,
    id,
    value,
    handleChangeTextInput,
    listOpts,
    keyValue,
    keyDesc,
  } = props;

  function change(value: string) {
    return handleChangeTextInput(value);
  }

  return (
    <select
      value={value ?? ""}
      id={id}
      placeholder={placeholder}
      className={"input-text-custom"}
      onChange={(e) => {
        change(e.target.value);
      }}
    >
      <option key={0} value={0}>
        {placeholder}
      </option>
      {listOpts.map((item) => (
        <option key={item[keyValue]} value={item[keyValue]}>
          {item[keyDesc]}
        </option>
      ))}
    </select>
  );
}

export default SelectInput;
