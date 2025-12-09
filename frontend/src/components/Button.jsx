import '../styles/Button.css';

/**
 * Reusable button component with multiple variants.
 */
const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = size !== 'md' ? `btn-${size}` : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClass} ${variantClass} ${sizeClass} ${className}`.trim()}
            {...props}
        >
            {loading ? (
                <>
                    <div className="spinner spinner-sm"></div>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
