
export default function Icon({icon, variant="rounded", filled, white=false, className}){
    return <span className={`${filled ? 'filled' : ""} material-symbols-${variant} icon ${white && 'icon-white'} ${className}`}>
        {icon}
    </span>
}