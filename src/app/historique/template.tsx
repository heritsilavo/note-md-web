"use client"
import "@/css/disable-body-scroll.css"
import { ModalComponent } from "@heritsilavo/modal/next";
export default function Template({ children }: { children: React.ReactNode }) {
    return <div className="z-[9999] w-[100dvw] h-[calc(100vh-(53px+68px))] overflow-x-hidden overflow-y-scroll">
        <ModalComponent> {children} </ModalComponent>
    </div>
}