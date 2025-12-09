/**
 * Reusable input component with label and error handling.
 */
const Input = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    required = false,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <div className="form-group">
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}
                    {required && <span style={{ color: 'var(--error)' }}> *</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                className={`input ${error ? 'input-error' : ''} ${className}`.trim()}
                {...props}
            />
            {error && <div className="form-error">{error}</div>}
        </div>
    );
};

export default Input;
