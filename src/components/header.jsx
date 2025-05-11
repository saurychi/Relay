import './css/header.css'

export const Header = () => {
    return (
        <header>
            <div className="header">
                <h1>My App</h1>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/signup">Sign Up</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
