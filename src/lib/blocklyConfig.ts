import * as Blockly from 'blockly';

export function initializeBlocklyBlocks(): void {
  // Block: Get Tick
  Blockly.Blocks['deriv_get_tick'] = {
    init: function(this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("Get tick for")
        .appendField(new Blockly.FieldDropdown([
          ["Volatility 10 Index", "R_10"],
          ["Volatility 25 Index", "R_25"],
          ["Volatility 50 Index", "R_50"],
          ["Volatility 75 Index", "R_75"],
          ["Volatility 100 Index", "R_100"],
          ["Boom 1000", "BOOM1000"],
          ["Crash 1000", "CRASH1000"]
        ]), "SYMBOL");
      this.setOutput(true, "Number");
      this.setColour(230);
      this.setTooltip("Get current tick value for symbol");
      this.setHelpUrl("");
    }
  };

  // Block: Compare Ticks
  Blockly.Blocks['deriv_compare_ticks'] = {
    init: function(this: Blockly.Block) {
      this.appendValueInput("TICK1")
        .setCheck("Number")
        .appendField("Tick");
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [">", "GT"],
          ["<", "LT"],
          [">=", "GTE"],
          ["<=", "LTE"],
          ["=", "EQ"]
        ]), "OPERATOR");
      this.appendValueInput("TICK2")
        .setCheck("Number");
      this.setInputsInline(true);
      this.setOutput(true, "Boolean");
      this.setColour(210);
      this.setTooltip("Compare two tick values");
    }
  };

  // Block: Buy Contract
  Blockly.Blocks['deriv_buy_contract'] = {
    init: function(this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("Buy")
        .appendField(new Blockly.FieldDropdown([
          ["CALL (Rise)", "CALL"],
          ["PUT (Fall)", "PUT"]
        ]), "TYPE");
      this.appendValueInput("AMOUNT")
        .setCheck("Number")
        .appendField("stake");
      this.appendDummyInput()
        .appendField("duration")
        .appendField(new Blockly.FieldNumber(5, 1, 10), "DURATION")
        .appendField(new Blockly.FieldDropdown([
          ["ticks", "t"],
          ["minutes", "m"],
          ["seconds", "s"]
        ]), "DURATION_UNIT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Place a binary options trade");
    }
  };

  // Block: Log Message
  Blockly.Blocks['deriv_log'] = {
    init: function(this: Blockly.Block) {
      this.appendValueInput("MESSAGE")
        .setCheck(null)
        .appendField("Log");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
      this.setTooltip("Print message to bot logs");
    }
  };

  // Block: Wait Ticks
  Blockly.Blocks['deriv_wait_ticks'] = {
    init: function(this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("Wait")
        .appendField(new Blockly.FieldNumber(1, 1, 100), "TICKS")
        .appendField("ticks");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip("Pause execution for N ticks");
    }
  };

  // Block: Get Previous Tick
  Blockly.Blocks['deriv_previous_tick'] = {
    init: function(this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("Previous tick");
      this.setOutput(true, "Number");
      this.setColour(230);
      this.setTooltip("Get the previous tick value");
    }
  };

  // Block: Repeat Trade
  Blockly.Blocks['deriv_repeat_trade'] = {
    init: function(this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("Repeat trade")
        .appendField(new Blockly.FieldNumber(1, 1, 100), "TIMES")
        .appendField("times");
      this.appendStatementInput("DO")
        .appendField("do");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip("Repeat trading action N times");
    }
  };
}

export function getBlocklyToolbox(): string {
  return `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Market" colour="230">
    <block type="deriv_get_tick"></block>
    <block type="deriv_previous_tick"></block>
    <block type="deriv_compare_ticks"></block>
  </category>
  <category name="Trade" colour="160">
    <block type="deriv_buy_contract">
      <value name="AMOUNT">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>
  </category>
  <category name="Control" colour="290">
    <block type="deriv_wait_ticks"></block>
    <block type="deriv_repeat_trade"></block>
    <block type="controls_if"></block>
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
  </category>
  <category name="Logic" colour="210">
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_boolean"></block>
  </category>
  <category name="Math" colour="230">
    <block type="math_number"></block>
    <block type="math_arithmetic">
      <value name="A">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="B">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>
  </category>
  <category name="Utility" colour="20">
    <block type="deriv_log">
      <value name="MESSAGE">
        <shadow type="text">
          <field name="TEXT">Hello</field>
        </shadow>
      </value>
    </block>
  </category>
</xml>
  `;
}