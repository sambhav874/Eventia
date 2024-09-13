import './styles.css'
const FlipMeCard = () => {
    return (

<div className="flip-card w-full h-full">
    <div className="flip-card-inner">
        <div className="flip-card-front">
            <p className="title">FLIP CARD</p>
            <p>Hover Me</p>
        </div>
        <div className="flip-card-back">
            <p className="title">BACK</p>
            <p>Leave Me</p>
        </div>
    </div>
</div>
    )
}

export default FlipMeCard;