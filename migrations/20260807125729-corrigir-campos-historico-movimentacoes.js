'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /*
     * equip_recip_id não possui Foreign Key.
     * Existe apenas um índice com esse nome.
     */
    await queryInterface.removeIndex(
      'historico_movimentacoes',
      'fk_historico_equip_recip'
    );

    /*
     * Estes três campos possuem Foreign Keys reais
     * para itens_pedido.
     */
    await queryInterface.removeConstraint(
      'historico_movimentacoes',
      'fk_historico_item_sep'
    );

    await queryInterface.removeConstraint(
      'historico_movimentacoes',
      'fk_historico_item_entr'
    );

    await queryInterface.removeConstraint(
      'historico_movimentacoes',
      'fk_historico_item_conc'
    );

    /*
     * Remove as antigas colunas tratadas incorretamente
     * como UUID/FK.
     */
    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'equip_recip_id'
    );

    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'itm_sep_id'
    );

    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'itm_entr_id'
    );

    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'itm_conc_id'
    );

    /*
     * EquipRecip no AppSheet é texto,
     * não uma referência para equip_recip.id.
     */
    await queryInterface.addColumn(
      'historico_movimentacoes',
      'equip_recip',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );

    /*
     * ItmSep, ItmEntr e ItmConc são booleanos
     * no conjunto de dados original.
     */
    await queryInterface.addColumn(
      'historico_movimentacoes',
      'itm_sep',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'historico_movimentacoes',
      'itm_entr',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'historico_movimentacoes',
      'itm_conc',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /*
     * Remove os novos campos.
     */
    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'itm_conc'
    );

    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'itm_entr'
    );

    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'itm_sep'
    );

    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'equip_recip'
    );

    /*
     * Restaura as antigas colunas UUID.
     */
    await queryInterface.addColumn(
      'historico_movimentacoes',
      'equip_recip_id',
      {
        type: Sequelize.UUID,
        allowNull: false
      }
    );

    await queryInterface.addColumn(
      'historico_movimentacoes',
      'itm_sep_id',
      {
        type: Sequelize.UUID,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'historico_movimentacoes',
      'itm_entr_id',
      {
        type: Sequelize.UUID,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'historico_movimentacoes',
      'itm_conc_id',
      {
        type: Sequelize.UUID,
        allowNull: true
      }
    );

    /*
     * equip_recip_id originalmente possuía somente índice.
     */
    await queryInterface.addIndex(
      'historico_movimentacoes',
      ['equip_recip_id'],
      {
        name: 'fk_historico_equip_recip'
      }
    );

    /*
     * Restaura as três Foreign Keys originais.
     */
    await queryInterface.addConstraint(
      'historico_movimentacoes',
      {
        fields: ['itm_sep_id'],
        type: 'foreign key',
        name: 'fk_historico_item_sep',
        references: {
          table: 'itens_pedido',
          field: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    );

    await queryInterface.addConstraint(
      'historico_movimentacoes',
      {
        fields: ['itm_entr_id'],
        type: 'foreign key',
        name: 'fk_historico_item_entr',
        references: {
          table: 'itens_pedido',
          field: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    );

    await queryInterface.addConstraint(
      'historico_movimentacoes',
      {
        fields: ['itm_conc_id'],
        type: 'foreign key',
        name: 'fk_historico_item_conc',
        references: {
          table: 'itens_pedido',
          field: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    );
  }
};