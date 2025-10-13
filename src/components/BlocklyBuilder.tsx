import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { initializeBlocklyBlocks, getBlocklyToolbox } from '../lib/blocklyConfig';

interface BlocklyBuilderProps {
  onWorkspaceChange?: (workspace: Blockly.WorkspaceSvg) => void;
  initialXml?: string;
}

export const BlocklyBuilder: React.FC<BlocklyBuilderProps> = ({
  onWorkspaceChange,
  initialXml
}) => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!blocklyDiv.current || workspace.current) return;

    // Initialize custom blocks
    initializeBlocklyBlocks();

    // Create workspace
    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: getBlocklyToolbox(),
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      trashcan: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true
      }
    });

    // Load initial XML if provided
    if (initialXml) {
      try {
        const xml = Blockly.Xml.textToDom(initialXml);
        Blockly.Xml.domToWorkspace(xml, workspace.current);
      } catch (error) {
        console.error('Failed to load initial XML:', error);
      }
    }

    // Listen for changes
    const changeListener = () => {
      if (workspace.current && onWorkspaceChange) {
        onWorkspaceChange(workspace.current);
      }
    };

    workspace.current.addChangeListener(changeListener);

    // Cleanup
    return () => {
      if (workspace.current) {
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={blocklyDiv} 
      className="w-full h-[600px] border border-gray-300 rounded-lg"
    />
  );
};