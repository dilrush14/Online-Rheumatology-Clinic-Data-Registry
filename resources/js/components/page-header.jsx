export default function PageHeader({ title, actions = null, showDivider = true }) {
    return (
        <div className="bg-white px-4 py-4 shadow-sm rounded-md mb-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            {showDivider && <hr className="mt-3 border-gray-200" />}
        </div>
    );
}
