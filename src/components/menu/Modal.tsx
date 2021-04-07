import React, {ComponentType} from "react";
import {Modal} from "react-native-paper";
import {styles} from "../../ui/styles";

export const makeModal = <Props extends MenuModalProps>(Contents: ComponentType<Props>) =>
    (props: Props) => (
        <Modal
            dismissable={true}
            onDismiss={props.close}
            visible={props.isOpen}
            contentContainerStyle={[styles.centerContents, styles.modal]}
        >
            <Contents {...props}/>
        </Modal>
    );

export interface MenuModalProps {
    close(): void;
    isOpen: boolean;
}
