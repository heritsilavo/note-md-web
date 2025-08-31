"use client"
import { ModalComponent } from "@heritsilavo/modal/next";
export default function Template({ children }: { children: React.ReactNode }) {
    return <ModalComponent> {children} </ModalComponent>
}