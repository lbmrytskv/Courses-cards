

export default function Input(props) {
  return (
    <div className="input-group">
      <label className="input-label">
        {props.labelText}
        <input
          type={props.type || 'text'}
          placeholder={props.placeholderText}
          onChange={props.onChange}
          value={props.value}
          name={props.name}
          className="input-field"
        />
      </label>
    </div>
  );
}

