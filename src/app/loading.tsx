import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
    return <div className="flex flex-col items-center justify-center mt-20">
        <LoadingSpinner text="Chargement des notes ..." width={60} height={70} color="rgb(73,73,73)"></LoadingSpinner>
    </div>
}